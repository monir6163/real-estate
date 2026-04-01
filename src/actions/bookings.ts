"use server";

import { getErrorMessage, parseApiErrorMessage } from "@/lib/error-message";
import { cookies } from "next/headers";

interface BookingPayload {
  agentId: string;
  propertyId: string;
  visitDate: string;
  message?: string;
}

interface BookingResponse {
  id: string;
  propertyId: string;
  agentId: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLATION_REQUESTED"
    | "CANCELLED";
  message?: string;
  visitDate?: string;
  createdAt: string;
  updatedAt: string;
  payment?: {
    id: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
    amount: number;
  };
  property?: {
    id: string;
    title: string;
    price: number;
    location: string;
  };
}

interface BookingsApiResponse {
  success: boolean;
  message: string;
  data: BookingResponse[];
}

interface BookingApiResponse {
  success: boolean;
  message: string;
  data: BookingResponse;
}

// Create a booking
export const createBooking = async (payload: BookingPayload) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();

    // Convert visitDate string to ISO date string for backend
    const bookingData = {
      ...payload,
      visitDate: new Date(payload.visitDate).toISOString(),
    };

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not create your booking. Please try again.",
        ),
      );
    }

    const data: BookingApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(
        error,
        "Could not create your booking. Please try again.",
      ),
    };
  }
};

// Get user's bookings
export const getMyBookings = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings/my-bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load your bookings right now.",
        ),
      );
    }

    const data: BookingsApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      data: [],
      error: getErrorMessage(error, "Could not load your bookings right now."),
    };
  }
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load all bookings at the moment.",
        ),
      );
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
    };
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return {
      success: false,
      data: [],
      error: getErrorMessage(
        error,
        "Could not load all bookings at the moment.",
      ),
    };
  }
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load booking details right now.",
        ),
      );
    }

    const data: BookingApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(
        error,
        "Could not load booking details right now.",
      ),
    };
  }
};

// Update booking status
export const updateBookingStatus = async (
  id: string,
  status: "APPROVED" | "REJECTED" | "CANCELLED",
) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/bookings/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await cookies()).toString(),
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not update booking status. Please try again.",
        ),
      );
    }

    const data: BookingApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(
        error,
        "Could not update booking status. Please try again.",
      ),
    };
  }
};

// Cancel pending booking
export const deleteBooking = async (bookingId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/bookings/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await cookies()).toString(),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not process booking cancellation. Please try again.",
        ),
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Booking cancellation processed successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return {
      success: false,
      error: getErrorMessage(
        error,
        "Could not process booking cancellation. Please try again.",
      ),
      data: null,
    };
  }
};

export const cancelBooking = async (bookingId: string) => {
  return deleteBooking(bookingId);
};
