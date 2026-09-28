REAL DEPLOYMENT NOTES
1. Deploy this folder to a Node.js HTTPS host.
2. Create/configure a Meta Developer App.
3. Put the App ID and App Secret in environment variables.
4. Add BASE_URL + /auth/meta/callback as the OAuth redirect URI in Meta.
5. Request only the permissions your approved Meta use case actually needs.
6. Implement secure server-side token exchange and encrypted token storage before using production account insights.
7. Never ask users for Instagram/Facebook passwords.

The QR is included as payment-qr.png.
