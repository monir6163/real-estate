"use server";

interface BookingPayload {
  propertyId: string;
  visitDate?: string;
  message?: string;
}

interface BookingResponse {
  id: string;
  propertyId: string;
  agentId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  message?: string;
  visitDate?: string;
  createdAt: string;
  updatedAt: string;
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

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch booking");
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
      error: error instanceof Error ? error.message : "Unknown error",
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
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update booking status");
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
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
