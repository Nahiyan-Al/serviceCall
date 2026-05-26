# Deploying to Firebase Hosting

Vite reads `VITE_FIREBASE_*` variables **when you run `npm run build`**. They are baked into the `dist/` JavaScript. Firebase Hosting only uploads `dist/` — it does not read your local `.env` file.

If you deploy a build made without those variables, the live site shows “Firebase is not configured.”

## Option A — Deploy from your computer (quickest)

1. Ensure `.env` in the project root is filled in (copy from `.env.example` + Firebase Console).
2. Build and deploy:

   ```powershell
   npm run build
   firebase deploy --only hosting
   ```

3. Optionally deploy database rules:

   ```powershell
   firebase deploy --only database
   ```

## Option B — Deploy via GitHub Actions

`.github/workflows/firebase-hosting.yml` builds on every push to `main`.

1. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**  
   Add the same seven names as in `.env` (values from Firebase Console → Project settings → Your apps → Config).

2. Create a Firebase service account for CI:
   - Firebase Console → Project settings → **Service accounts** → **Generate new private key**
   - In GitHub, add secret `FIREBASE_SERVICE_ACCOUNT` with the **entire JSON file** contents.

3. Push to `main`. The workflow builds with secrets and deploys Hosting.

## Administrator access

Course edits require an entry in the Realtime Database:

```json
{
  "admins": {
    "YOUR_FIREBASE_AUTH_UID": true
  }
}
```

Copy your UID from Firebase Console → **Authentication** → **Users** → **Copy UID**. Import `database/seed/admins.example.json` (with your UID filled in) or add the node manually in the database viewer.

Deploy rules after changes:

```powershell
firebase deploy --only database
```

## Notes

- `.env` is gitignored on purpose — never commit it.
- Firebase web API keys still appear inside the built JS bundle on the live site; that is normal for client-side Firebase apps. Restrict abuse with **Authentication** and **database rules**, not by hiding the key from the bundle.
