window.AI_AISSTEN_FIREBASE_CONFIG = null;

window.AI_AISSTEN_BOOKING_CONFIG = {
  slotCount: 6,
  availabilityCollection: "aiAvailabilitySlots",
  appointmentsCollection: "aiAppointments",
  // Optional: Cloud Functions endpoints. These make bookings safer because the
  // backend can block a slot and save the appointment atomically.
  // Example:
  // availabilityApiUrl: "https://<region>-<project-id>.cloudfunctions.net/getAvailability",
  // bookingApiUrl: "https://<region>-<project-id>.cloudfunctions.net/createBooking",
};

window.AI_AISSTEN_PRODUCTS_CONFIG = {
  collection: "siteProducts",
  // Optional Cloud Function endpoint. If this is not set, the page can read
  // directly from Firestore when AI_AISSTEN_FIREBASE_CONFIG is configured.
  // Example:
  // apiUrl: "https://europe-west1-<project-id>.cloudfunctions.net/getProducts",
};

window.AI_AISSTEN_CHAT_CONFIG = {
  apiUrl: "https://adazai-api.adazrenov.workers.dev/chat",
  enablePageChat: false,
  // Optional endpoint for sending Assistant Construction lead summaries by email.
  // leadApiUrl: "https://europe-west1-<project-id>.cloudfunctions.net/sendChatLead",
};
