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

export const getAllUsers = async () => {
  try {
    const cookieStore = await cookies();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        data: null,
        message: error.message || "Failed to fetch users",
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || result,
      message: "Users fetched successfully",
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to fetch users",
      status: false,
    };
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const cookieStore = await cookies();
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        data: null,
        message: error.message || "Failed to update user status",
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || result,
      message: "User status updated successfully",
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to update user status",
      status: false,
    };
  }
};

export const updateUserProfile = async (profileData: any) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/users/profile/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(profileData),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        data: null,
        message: error.message || "Failed to update user profile",
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data,
      message: result.message || "User profile updated successfully",
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user profile",
      status: false,
    };
  }
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};
