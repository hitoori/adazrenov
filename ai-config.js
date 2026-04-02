window.AI_AISSTEN_FIREBASE_CONFIG = null;

window.AI_AISSTEN_BOOKING_CONFIG = {
  slotCount: 6,
  availabilityCollection: "aiAvailabilitySlots",
  appointmentsCollection: "aiAppointments",
  // Optional: Cloud Functions endpoints.
  // Example:
  // availabilityApiUrl: "https://<region>-<project-id>.cloudfunctions.net/getAvailability",
  // bookingApiUrl: "https://<region>-<project-id>.cloudfunctions.net/createBooking",
};

window.AI_AISSTEN_CHAT_CONFIG = {
  // Optional endpoint for real AI (ChatGPT) integration via backend.
  // Keep OpenAI key ONLY on server side.
  // apiUrl: "https://europe-west1-<project-id>.cloudfunctions.net/adazChat",
  model: "gpt-4o-mini",
};
