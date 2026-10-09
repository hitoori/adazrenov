window.AI_AISSTEN_FIREBASE_CONFIG = null;

// After Firebase Functions are deployed, set this once and the site will use it
// for getProducts, getAvailability, createBooking, adazChat, contact and leads.
// Example: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net"
window.AI_AISSTEN_FUNCTIONS_BASE_URL = "";

window.AI_AISSTEN_CONTACT_CONFIG = {
  deliveryProvider: "resend",
  apiUrl: "https://adazai-api.adazrenov.workers.dev/contact",
};

window.AI_AISSTEN_BOOKING_CONFIG = {
  deliveryProvider: "disabled",
  slotCount: 6,
  availabilityCollection: "aiAvailabilitySlots",
  appointmentsCollection: "aiAppointments",
  // Requests are submitted exclusively through the Contact page.
  // Optional endpoint for displaying availability:
  // availabilityApiUrl: "https://<region>-<project-id>.cloudfunctions.net/getAvailability",
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
  // The Worker holds the OpenAI secret; suggested questions use the same chat endpoint.
  useOpenAIForSuggestions: true,
};
