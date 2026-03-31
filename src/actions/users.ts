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

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const result = await res.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to fetch user data",
      status: false,
    };
  }
};
