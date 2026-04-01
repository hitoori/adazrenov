const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { google } = require("googleapis");

admin.initializeApp();
const db = admin.firestore();

function setCorsHeaders(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function parseIntSafe(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function asIso(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function getGoogleCalendarClient() {
  const serviceAccountEmail = process.env.GCAL_SERVICE_ACCOUNT_EMAIL || "";
  const privateKeyRaw = process.env.GCAL_PRIVATE_KEY || "";
  const calendarId = process.env.GCAL_CALENDAR_ID || "";

  if (!serviceAccountEmail || !privateKeyRaw || !calendarId) {
    return null;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  await auth.authorize();

  return {
    calendar: google.calendar({ version: "v3", auth }),
    calendarId,
  };
}

function generateFallbackSlots(limit) {
  const results = [];
  const now = new Date();
  now.setDate(now.getDate() + 1);
  now.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; results.length < limit && dayOffset < 14; dayOffset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayOffset);

    if (day.getDay() === 0) continue;

    [9, 11, 14, 16].forEach((hour) => {
      if (results.length >= limit) return;

      const start = new Date(day);
      start.setHours(hour, 0, 0, 0);
      const end = addMinutes(start, 60);

      results.push({
        id: `fallback-${start.toISOString()}`,
        start: start.toISOString(),
        end: end.toISOString(),
        service: "Consultation",
        advisor: "ADAZ RENOV",
      });
    });
  }

  return results;
}

exports.getAvailability = onRequest({ region: "europe-west1" }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const limit = Math.min(20, Math.max(1, parseIntSafe(req.query.limit, 6)));

  try {
    const calendarClient = await getGoogleCalendarClient();
    if (!calendarClient) {
      res.json({ slots: generateFallbackSlots(limit), source: "fallback" });
      return;
    }

    const now = new Date();
    const endRange = new Date(now);
    endRange.setDate(endRange.getDate() + 21);

    const busyResp = await calendarClient.calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endRange.toISOString(),
        items: [{ id: calendarClient.calendarId }],
      },
    });

    const busyRanges = (busyResp.data?.calendars?.[calendarClient.calendarId]?.busy || []).map((range) => ({
      start: new Date(range.start),
      end: new Date(range.end),
    }));

    const slots = [];
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);

    for (let offset = 1; slots.length < limit && offset <= 21; offset += 1) {
      const day = new Date(dayStart);
      day.setDate(dayStart.getDate() + offset);
      if (day.getDay() === 0) continue;

      [9, 11, 14, 16].forEach((hour) => {
        if (slots.length >= limit) return;

        const start = new Date(day);
        start.setHours(hour, 0, 0, 0);
        const end = addMinutes(start, 60);

        const overlapsBusy = busyRanges.some((busy) => start < busy.end && end > busy.start);
        if (!overlapsBusy) {
          slots.push({
            id: `gcal-${start.toISOString()}`,
            start: start.toISOString(),
            end: end.toISOString(),
            service: "Consultation",
            advisor: "ADAZ RENOV",
          });
        }
      });
    }

    res.json({ slots, source: "google-calendar" });
  } catch (error) {
    logger.error("getAvailability failed", error);
    res.status(500).json({ error: "Failed to load availability" });
  }
});

exports.createBooking = onRequest({ region: "europe-west1" }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = req.body || {};
    const booking = {
      firstname: String(body.firstname || "").trim(),
      lastname: String(body.lastname || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim(),
      service: String(body.service || "Consultation"),
      notes: String(body.notes || "").trim(),
      slotId: String(body.slotId || ""),
      slotStart: asIso(body.slotStart),
      slotEnd: asIso(body.slotEnd),
      status: "pending",
      source: "web-ai-assistant",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!booking.firstname || !booking.lastname || !booking.phone || !booking.slotStart || !booking.slotEnd) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const firestoreRef = await db.collection("aiAppointments").add(booking);

    const calendarClient = await getGoogleCalendarClient();
    let calendarEventId = null;

    if (calendarClient) {
      const eventResp = await calendarClient.calendar.events.insert({
        calendarId: calendarClient.calendarId,
        requestBody: {
          summary: `Consultation ADAZ RENOV - ${booking.service}`,
          description: `Client: ${booking.firstname} ${booking.lastname}\nTelephone: ${booking.phone}\nEmail: ${booking.email || "non precise"}\nNotes: ${booking.notes || "Aucune"}`,
          start: { dateTime: booking.slotStart },
          end: { dateTime: booking.slotEnd },
        },
      });

      calendarEventId = eventResp.data?.id || null;
      if (calendarEventId) {
        await firestoreRef.update({
          status: "calendar-confirmed",
          calendarEventId,
        });
      }
    }

    res.status(201).json({
      ok: true,
      id: firestoreRef.id,
      calendarEventId,
    });
  } catch (error) {
    logger.error("createBooking failed", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});
