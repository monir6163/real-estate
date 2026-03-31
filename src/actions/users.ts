"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const getUserSession = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    const session = await res.json();
    if (session === null) {
      return { data: null, message: "No active session", status: false };
    }
    return { data: session, error: null, status: true };
  } catch (error) {
    return {
      data: null,
      message: "Failed to fetch session data",
      status: false,
    };
  }
};
