import { NextResponse } from "next/server";
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_X509_CERT_URL,
      universe_domain: "googleapis.com",
    }),
  });
}

export async function POST(req) {
  const requestBody = await req.json();
  const userEmail = requestBody && requestBody["user_email"];
  const newPass = requestBody && requestBody["new_password"];

  if (!userEmail) {
    console.error("Missing userEmail");
    return NextResponse.error("Bad Request", 400);
  }

  try {
    const link = await admin.auth().generatePasswordResetLink(userEmail);

    return NextResponse.json({ password_reset_link: link }, { status: 200 });
  } catch (error) {
    console.error("Error generating password reset link:", error.code);
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      return NextResponse.json({ error: "Server error!" }, { status: 500 });
    }
  }
}
