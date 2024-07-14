"use server"



import { cookies } from "next/headers";
import { AccountData } from "./types";

export async function getAccountData() {
  const cookieStore = cookies();
  const SESSION_ID = cookieStore.get("sessionid");

  if (!SESSION_ID) {
    throw new Error("Session ID not found in cookies");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/account/`, {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${SESSION_ID.value}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch account data");
  }

  return response.json();
}

