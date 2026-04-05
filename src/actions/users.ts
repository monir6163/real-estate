"use server";

import { getErrorMessage, parseApiErrorMessage } from "@/lib/error-message";
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
      message: getErrorMessage(error, "Could not load your session right now."),
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
      throw new Error(
        await parseApiErrorMessage(res, "Could not load your profile data."),
      );
    }

    const result = await res.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(error, "Could not load your profile data."),
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
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not load users right now.",
        ),
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
      message: getErrorMessage(error, "Could not load users right now."),
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
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not update user status. Please try again.",
        ),
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
      message: getErrorMessage(
        error,
        "Could not update user status. Please try again.",
      ),
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
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not update your profile. Please try again.",
        ),
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
      message: getErrorMessage(
        error,
        "Could not update your profile. Please try again.",
      ),
      status: false,
    };
  }
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not send reset OTP. Please try again.",
        ),
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || null,
      message: result.message || "Reset OTP sent successfully",
      status: true,
    };
  } catch (error) {
    return {
      data: null,
      message: getErrorMessage(
        error,
        "Could not send reset OTP. Please try again.",
      ),
      status: false,
    };
  }
};

export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not reset your password. Please try again.",
        ),
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || null,
      message: result.message || "Password reset successfully",
      status: true,
    };
  } catch (error) {
    return {
      data: null,
      message: getErrorMessage(
        error,
        "Could not reset your password. Please try again.",
      ),
      status: false,
    };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/auth/resend-verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not resend verification email. Please try again.",
        ),
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || null,
      message: result.message || "Verification email resent successfully",
      status: true,
    };
  } catch (error) {
    return {
      data: null,
      message: getErrorMessage(
        error,
        "Could not resend verification email. Please try again.",
      ),
      status: false,
    };
  }
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        message: await parseApiErrorMessage(
          response,
          "Could not change your password. Please try again.",
        ),
        status: false,
      };
    }

    const result = await response.json();
    return {
      data: result.data || null,
      message: result.message || "Password changed successfully",
      status: true,
    };
  } catch (error) {
    return {
      data: null,
      message: getErrorMessage(
        error,
        "Could not change your password. Please try again.",
      ),
      status: false,
    };
  }
};
