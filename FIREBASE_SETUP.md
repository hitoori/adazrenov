# Firebase + Calendar setup (AI Aissten)

This project is now prepared for real booking flow with:
- Frontend booking UI in `ia-travaux.html`
- Frontend logic in `script.js`
- Cloud Functions in `firebase/functions/index.js`

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

After deploy, copy the two endpoints:
- `getAvailability`
- `createBooking`

## 7. Configure frontend runtime
Edit `ai-config.js` and set:
- `window.AI_AISSTEN_FIREBASE_CONFIG` (optional for direct Firestore fallback)
- `window.AI_AISSTEN_BOOKING_CONFIG.availabilityApiUrl`
- `window.AI_AISSTEN_BOOKING_CONFIG.bookingApiUrl`

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
```

## 8. Optional Firestore collections
If you want manual fallback slots without API, create:
- `aiAvailabilitySlots`
  - `status`: `open`
  - `startAt`: Timestamp
  - `endAt`: Timestamp
  - `advisor`: string
  - `service`: string
- `aiAppointments`
  - stores booking requests from form

## 9. Apple Calendar support
Frontend already generates `.ics` file for Apple Calendar import.
No server setup needed for this part.

## 10. Deploy site files
Push to GitHub Pages as usual.

---
If you want, next step can be:
- admin page for presenters to block/free slots
- anti-overbooking checks in function
- SMS/email confirmation for clients
