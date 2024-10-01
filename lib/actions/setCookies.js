"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function SetCookies(name, value) {
  // cookies().set(name, value, { secure: true });
  redirect("/onboarding");
}

export { SetCookies };
