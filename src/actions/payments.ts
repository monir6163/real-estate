"use server";

import { cookies } from "next/headers";

interface CheckoutSessionResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

interface PaymentResponse {
  id: string;
  bookingId?: string;
  propertyId: string;
  amount: number;
  purpose: "BOOKING_FEE" | "PREMIUM_LISTING_FEE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

interface PaymentsApiResponse {
  success: boolean;
  message: string;
  data: PaymentResponse[];
}

// Create booking checkout session (call this for payment)
export const createBookingCheckout = async (bookingId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();

    const response = await fetch(
      `${BACKEND_URL}/api/v1/payments/checkout/booking/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkout session");
    }

    const data: CheckoutSessionResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Get user's payments
export const getMyPayments = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/payments/my-payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }

    const data: PaymentsApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
