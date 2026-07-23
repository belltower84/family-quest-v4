// Replace the placeholder values below with the Config values shown in
// Firebase Console > Project settings > General > Your apps > SDK setup and configuration > Config.
// This web config is meant to be used in browser code. Never add a service-account key here.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "bell-family-quest.firebaseapp.com",
  projectId: "bell-family-quest",
  storageBucket: "bell-family-quest.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_APP_ID_HERE"
};

export const firebaseConfigured = !Object.values(firebaseConfig).some((value) =>
  String(value).startsWith("PASTE_")
);
