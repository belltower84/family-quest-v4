# Family Quest 4.0 Alpha

A responsive family operating system with a parent phone dashboard and kid-focused MacBook dashboards.

## Current build

- Landing screen for Wyatt, Nolan, and Parent Dashboard
- Responsive kid dashboard prototype
- Responsive parent dashboard prototype
- Firebase modular browser SDK wiring
- Google Authentication wiring
- Firestore deny-all starter rules

## Connect Firebase

1. Open `js/firebase-config.js`.
2. In Firebase Console, go to **Project settings → General → Your apps → Family Quest Web**.
3. Select **Config** under SDK setup and configuration.
4. Copy only the missing `apiKey`, `messagingSenderId`, and `appId` values into the file.
5. Commit and push.

The Firebase web configuration is not a service-account secret. Never commit service-account JSON, private keys, passwords, or GitHub tokens.

## GitHub Pages

Repository **Settings → Pages**:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/(root)`

## Next sprint

- Create the Bell family Firestore record
- Establish approved parent membership
- Add a hashed parent PIN workflow
- Replace demo quests with live Firestore data
- Add secure child-device sessions and permission rules
