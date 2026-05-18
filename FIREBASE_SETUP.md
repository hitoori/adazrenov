# Firebase + ADAZAI setup

This project is prepared for a useful ADAZAI flow with:
- Frontend booking UI in `ia-travaux.html`
- Frontend logic in `script.js`
- Cloud Functions in `firebase/functions/index.js`
- Firestore conversations, appointments and availability slots
- Optional Apple Calendar availability sync through a published `.ics` calendar URL

## 1. Create Firebase project
1. Go to Firebase Console.
2. Create a project.
3. Enable Firestore Database.
4. Enable billing (Blaze) if you want Cloud Functions + Google Calendar in production.

## 2. Update local project id
Edit `.firebaserc` and replace:
- `YOUR_FIREBASE_PROJECT_ID`

## 3. Install Firebase CLI and login
```bash
npm install -g firebase-tools
firebase login
```

## 4. Install Functions dependencies
```bash
cd firebase/functions
npm install
cd ../..
```

## 5. Configure Google Calendar service account
Create a Google Cloud service account and share your Google Calendar with that service account email.

Set these environment variables for functions:
- `GCAL_SERVICE_ACCOUNT_EMAIL`
- `GCAL_PRIVATE_KEY`
- `GCAL_CALENDAR_ID`

Example command:
```bash
firebase functions:config:set \
  gcal.service_account_email="YOUR_SERVICE_ACCOUNT_EMAIL" \
  gcal.private_key="YOUR_PRIVATE_KEY" \
  gcal.calendar_id="YOUR_CALENDAR_ID"
```

Note: in this starter, functions read from process env (`GCAL_*`).
If you prefer `functions:config`, adapt `firebase/functions/index.js` to read from `firebase-functions/params` or config values.

## 6. Deploy functions
```bash
firebase deploy --only functions
```

After deploy, copy the endpoints:
- `getProducts`
- `getAvailability`
- `createBooking`
- `adazChat`
- `syncAppleAvailability`

## 6.1 ADAZAI chat without OpenAI
`adazChat` now works without OpenAI. It uses a local ADAZAI intent engine that can:
- understand common renovation messages;
- answer about estimates, materials, photos, urgent support and bookings;
- return action buttons for the frontend;
- save the conversation to Firestore in `aiConversations`.

OpenAI can still be added later, but it is optional. If you want it later, set:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, default `gpt-4o-mini`)

Example (local deploy shell):
```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-4o-mini"
firebase deploy --only functions
```

## 7. Configure frontend runtime
Edit `ai-config.js` and set:
- `window.AI_AISSTEN_FIREBASE_CONFIG` (optional for direct Firestore fallback)
- `window.AI_AISSTEN_PRODUCTS_CONFIG.apiUrl` (optional, for loading products from Firestore through Cloud Functions)
- `window.AI_AISSTEN_BOOKING_CONFIG.availabilityApiUrl`
- `window.AI_AISSTEN_BOOKING_CONFIG.bookingApiUrl`
- `window.AI_AISSTEN_CHAT_CONFIG.apiUrl`

Example:
```js
window.AI_AISSTEN_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

window.AI_AISSTEN_BOOKING_CONFIG = {
  slotCount: 6,
  availabilityCollection: "aiAvailabilitySlots",
  appointmentsCollection: "aiAppointments",
  availabilityApiUrl: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net/getAvailability",
  bookingApiUrl: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net/createBooking",
};

window.AI_AISSTEN_PRODUCTS_CONFIG = {
  collection: "siteProducts",
  apiUrl: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net/getProducts",
};

window.AI_AISSTEN_CHAT_CONFIG = {
  apiUrl: "https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net/adazChat",
  model: "local-adazai",
};
```

## 8. Firestore collections
ADAZAI uses these collections:
- `siteProducts`
  - stores products displayed on `produits.html`
  - fields: `category`, `active`, `order`, `id`, `title`, `material`, `imagePath`
  - for doors: `colors`, `schemaPath`
  - for windows: `description`, `tech`
  - for shutters: `feature`
- `aiAvailabilitySlots`
  - `status`: `open`
  - `startAt`: Timestamp
  - `endAt`: Timestamp
  - `advisor`: string
  - `service`: string
  - `source`: `manual`, `apple-calendar` or `firebase`
- `aiAppointments`
  - stores booking requests from form
- `aiConversations`
  - one document per chat conversation
  - each conversation has a `messages` subcollection

### 8.1 Product documents
Create documents in Firestore collection `siteProducts`. Each document can have any id, for example
`door-01`, `window-entra`, `shutter-01`.

Door example:
```json
{
  "category": "doors",
  "active": true,
  "order": 1,
  "id": 1,
  "title": "Porte d'entrée modèle 01",
  "material": "metal",
  "colors": ["Noir mat"],
  "imagePath": "usiproduse/Panneau01/Panneau01.png",
  "schemaPath": "usiproduse/Panneau01/Panneau01schema.png"
}
```

Window example:
```json
{
  "category": "windows",
  "active": true,
  "order": 1,
  "id": 1,
  "title": "Fenetre aluminium ENTRA",
  "material": "aluminium",
  "description": "Profil aluminium moderne avec isolation renforcee.",
  "imagePath": "assets/catalogue/geamuri/fenetre-modele-01/fenetre-modele-01-vue.webp",
  "tech": {
    "joints": 3,
    "chambers": 3,
    "depth": "70 mm",
    "glazing": "jusqu'a 48 mm",
    "uw": "0,85",
    "ug": "0,5"
  }
}
```

Shutter example:
```json
{
  "category": "shutters",
  "active": true,
  "order": 1,
  "id": 1,
  "title": "Volet roulant exterieur modele 01",
  "feature": "Coffre apparent",
  "imagePath": "assets/catalogue/volets/volet-roulant-exterieur-modele-01/volet-roulant-exterieur-modele-01.webp"
}
```

If the Cloud Function `getProducts` or Firestore config is not available, the site keeps using the
local catalogue already defined in `script.js`.

## 9. Apple Calendar support
Firebase cannot read your private Apple Calendar by itself. The practical setup is:

1. Create a separate Apple Calendar, for example `ADAZ Disponibil`.
2. Add events only when you are free for visits.
3. Publish/share that calendar and copy its `.ics` subscription URL.
4. Set this environment variable for Cloud Functions:

```bash
export APPLE_CALENDAR_ICS_URL="https://pXX-caldav.icloud.com/published/..."
firebase deploy --only functions
```

Then run the sync endpoint once:

```text
https://europe-west1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net/syncAppleAvailability
```

The scheduled function `scheduledAppleAvailabilitySync` also refreshes the slots every 15 minutes.
Imported Apple slots are written into `aiAvailabilitySlots`, and the site reads them through
`getAvailability` or directly from Firestore if `window.AI_AISSTEN_FIREBASE_CONFIG` is configured.

Optional filter:
- `APPLE_CALENDAR_FREE_KEYWORDS="disponibil,libre,available"`

If this variable is set, only Apple events whose title contains one of those words are imported.
If it is not set, all events from the published availability calendar are treated as free slots.

## 10. Deploy site files
Push to GitHub Pages as usual.

---
If you want, next step can be:
- admin page for presenters to block/free slots
- anti-overbooking checks in function
- SMS/email confirmation for clients
