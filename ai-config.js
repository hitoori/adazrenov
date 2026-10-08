window.AI_AISSTEN_FIREBASE_CONFIG = null;

// After Firebase Functions are deployed, set this once and the site will use it
// for getProducts, getAvailability, createBooking, adazChat, contact and leads.
// Example: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net"
window.AI_AISSTEN_FUNCTIONS_BASE_URL = "";

window.AI_AISSTEN_CONTACT_CONFIG = {
  recipientEmail: "octavian.chiticgd@gmail.com",
  web3FormsAccessKey: "c651e977-90dd-44a5-b74f-7b3690d0a4f6",
  // Optional direct endpoint. If empty, FUNCTIONS_BASE_URL + /submitContactRequest is used.
  // apiUrl: "https://europe-west1-<project-id>.cloudfunctions.net/submitContactRequest",
};

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
