"use server";

import { getErrorMessage, parseApiErrorMessage } from "@/lib/error-message";
import { cookies } from "next/headers";

export const getReviewsByPropertyId = async (propertyId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();
    const response = await fetch(
      `${BACKEND_URL}/api/v1/reviews/property/${propertyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load reviews for this property.",
        ),
      );
    }

    const result = await response.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(
        error,
        "Could not load reviews for this property.",
      ),
      status: false,
    };
  }
};

export const checkUserReview = async (propertyId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();
    const response = await fetch(
      `${BACKEND_URL}/api/v1/reviews/my-reviews/${propertyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      },
    );

    const result = await response.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(error, "Could not check your review status."),
      status: false,
    };
  }
};

export const getAgentReviews = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/reviews/agent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(response, "Could not load agent reviews."),
      );
    }

    const result = await response.json();
    const reviewsWithUser = (result.data || []).map((review: any) => ({
      ...review,
      user: review.user || review.reviewer || undefined,
    }));
    return { data: reviewsWithUser, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(error, "Could not load agent reviews."),
      status: false,
    };
  }
};

export const getUserReviews = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/reviews/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(response, "Could not load your reviews."),
      );
    }

    const result = await response.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(error, "Could not load your reviews."),
      status: false,
    };
  }
};

export const getAllReviews = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load reviews right now.",
        ),
      );
    }

    const result = await response.json();
    const reviewsWithUser = (result.data || []).map((review: any) => ({
      ...review,
      user: review.user || review.agent || review.reviewer || undefined,
    }));

    return { data: reviewsWithUser, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: getErrorMessage(error, "Could not load reviews right now."),
      status: false,
    };
  }
};

export const submitReview = async (
  propertyId: string,
  rating: number,
  comment: string,
) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({
        propertyId,
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not submit your review. Please try again.",
        ),
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || "Review submitted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not submit your review. Please try again.",
      ),
      data: null,
    };
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not delete this review right now.",
        ),
      );
    }

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not delete this review right now.",
      ),
    };
  }
};
