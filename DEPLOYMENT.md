# Render Deployment Checklist

The Render error `querySrv ENOTFOUND _mongodb._tcp.cluster0.xxxxx.mongodb.net` means the app is using the example MongoDB Atlas host instead of your real Atlas cluster host.

## Fix on Render

1. Open MongoDB Atlas.
2. Go to your cluster and click **Connect**.
3. Choose **Drivers** and copy the Node.js connection string.
4. Replace `<username>`, `<password>`, and the cluster host with your real values.
5. In Render, open your web service, then go to **Environment**.
6. Add or update:

```env
NODE_ENV=production
ATLASDB_URL=mongodb+srv://your-db-user:your-url-encoded-password@cluster0.abc123.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=use-a-long-random-secret-here
```

7. In MongoDB Atlas, go to **Network Access** and allow Render to connect. For a student/demo deployment, `0.0.0.0/0` works, but a fixed IP is safer if your hosting plan provides one.
8. Redeploy the Render service.

## Render Settings

- Build Command: `npm install`
- Start Command: `npm start`
- Node version: pinned to Node 22 via `package.json`

If the password contains special characters like `@`, `#`, `/`, `?`, or `&`, URL-encode the password before putting it in `ATLASDB_URL`.
