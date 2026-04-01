"use server";

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
      throw new Error("Failed to fetch reviews");
    }

    const result = await response.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to fetch reviews",
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
      message: "Failed to check review",
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
      throw new Error("Failed to fetch reviews");
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
      message: "Failed to fetch reviews",
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
      throw new Error("Failed to fetch reviews");
    }

    const result = await response.json();
    return { data: result.data, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to fetch reviews",
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
      throw new Error("Failed to fetch reviews");
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
      message: "Failed to fetch reviews",
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
      const error = await response.json();
      throw new Error(error.message || "Failed to submit review");
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
      message:
        error instanceof Error ? error.message : "Failed to submit review",
      data: null,
    };
  }
};
