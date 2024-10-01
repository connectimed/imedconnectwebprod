import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  //   const userPhone = await req.json()["user_phone"];

  const requestBody = await req.json();
  const userPhone = requestBody && requestBody["user_phone"];
  const otpCode = requestBody && requestBody["otp_code"];
  const url = "https://messaging-service.co.tz/api/sms/v1/text/single";
  const authHeader = "Basic YWtpbGlrdWJ3YTpuZXh0YWtpbGkwMzAxPyo=";

  if (!userPhone) {
    console.error(
      'Missing or invalid "user_phone" property in the request body'
    );
    return NextResponse.error("Bad Request", 400);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: "IMEDConnect",
        to: userPhone,
        text: `Your OTP is ${otpCode}`,
        reference: "aswqetgcz",
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    console.log("Message sent successfully:", response.data);
    return NextResponse.json({ phone: "decrypted" });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.error("Bad Request", 400);
    throw error;
  }
}
