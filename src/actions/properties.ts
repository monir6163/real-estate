"use server";

import { getErrorMessage, parseApiErrorMessage } from "@/lib/error-message";
import { cookies } from "next/headers";

interface PropertiesFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  type?: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND";
  listingType?: "RENT" | "SALE";
}

interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  listingType: string;
  status: string;
  thumbnail: string;
  isFeatured: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  propertyImages?: Array<{
    id: string;
    url: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt?: string;
    agent?: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

export interface PropertiesApiResponse {
  success: boolean;
  message: string;
  data: PropertyResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAllProperties = async (filters?: PropertiesFilter) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("searchTerm", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.minPrice !== undefined)
      params.append("price[gte]", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("price[lte]", filters.maxPrice.toString());
    if (filters?.bedrooms !== undefined)
      params.append("bedrooms", filters.bedrooms.toString());
    if (filters?.bathrooms !== undefined)
      params.append("bathrooms", filters.bathrooms.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.listingType) params.append("listingType", filters.listingType);

    const url = `${BACKEND_URL}/api/v1/properties${params.toString() ? "?" + params.toString() : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load properties right now.",
        ),
      );
    }

    const data: PropertiesApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
      meta: data.meta,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      error: getErrorMessage(error, "Could not load properties right now."),
    };
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const url = `${BACKEND_URL}/api/v1/properties/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load property details right now.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: PropertyResponse } =
      await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(
        error,
        "Could not load property details right now.",
      ),
    };
  }
};

export const getFeaturedProperties = async (filters?: PropertiesFilter) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("searchTerm", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.minPrice !== undefined)
      params.append("price[gte]", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("price[lte]", filters.maxPrice.toString());
    if (filters?.bedrooms !== undefined)
      params.append("bedrooms", filters.bedrooms.toString());
    if (filters?.bathrooms !== undefined)
      params.append("bathrooms", filters.bathrooms.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.type) params.append("type", filters.type);

    const url = `${BACKEND_URL}/api/v1/properties/featured${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not load featured properties right now.",
        ),
      );
    }

    const data: PropertiesApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
      meta: data.meta,
    };
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return {
      success: false,
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      error: getErrorMessage(
        error,
        "Could not load featured properties right now.",
      ),
    };
  }
};

export const getPropertyTypeCounts = async () => {
  try {
    const [apartment, house, commercial, land] = await Promise.all([
      getAllProperties({ page: 1, limit: 1, type: "APARTMENT" }),
      getAllProperties({ page: 1, limit: 1, type: "HOUSE" }),
      getAllProperties({ page: 1, limit: 1, type: "COMMERCIAL" }),
      getAllProperties({ page: 1, limit: 1, type: "LAND" }),
    ]);

    return {
      success: true,
      data: {
        APARTMENT: apartment.success ? apartment.meta.total : 0,
        HOUSE: house.success ? house.meta.total : 0,
        COMMERCIAL: commercial.success ? commercial.meta.total : 0,
        LAND: land.success ? land.meta.total : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching property type counts:", error);
    return {
      success: false,
      data: {
        APARTMENT: 0,
        HOUSE: 0,
        COMMERCIAL: 0,
        LAND: 0,
      },
    };
  }
};

export const ownerGetProperties = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }
    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties/agent/properties`;
    const response = await fetch(url, {
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
          "Could not load your properties right now.",
        ),
      );
    }

    const data: PropertiesApiResponse = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    return {
      success: false,
      data: [],

      error: getErrorMessage(
        error,
        "Could not load your properties right now.",
      ),
    };
  }
};

export const createProperty = async (formData: FormData) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: formData,
      cache: "no-store",
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not create property. Please check the form and try again.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: PropertyResponse } =
      await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating property:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not create property. Please check the form and try again.",
      ),
      data: null,
    };
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties/${propertyId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not delete this property. Please try again.",
        ),
      );
    }

    // Handle 204 No Content or empty responses
    let message = "Property deleted successfully";
    if (
      response.status !== 204 &&
      response.headers.get("content-length") !== "0"
    ) {
      try {
        const data: { success: boolean; message: string } =
          await response.json();
        message = data.message || message;
      } catch {
        // Response is empty or not JSON, that's okay for DELETE
      }
    }

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error("Error deleting property:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not delete this property. Please try again.",
      ),
    };
  }
};

export const updateProperty = async (
  propertyId: string,
  formData: FormData,
) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties/${propertyId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not update property. Please review your changes and try again.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: PropertyResponse } =
      await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating property:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not update property. Please review your changes and try again.",
      ),
      data: null,
    };
  }
};

export const ownerBookings = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties/agent/bookings`;

    const response = await fetch(url, {
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
          "Could not load your booking requests right now.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: any[] } =
      await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    return {
      success: false,
      data: [],
      error: getErrorMessage(
        error,
        "Could not load your booking requests right now.",
      ),
    };
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "APPROVED" | "REJECTED",
) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/bookings/${bookingId}/status`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          "Could not update booking status. Please try again.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: any } =
      await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not update booking status. Please try again.",
      ),
      data: null,
    };
  }
};

export const resolveBookingCancellation = async (
  bookingId: string,
  decision: "APPROVE" | "REJECT",
) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/bookings/${bookingId}/cancel-decision`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ decision }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await parseApiErrorMessage(
          response,
          `Could not ${decision.toLowerCase()} cancellation request. Please try again.`,
        ),
      );
    }

    const data: { success: boolean; message: string; data: any } =
      await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error resolving cancellation request:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not resolve cancellation request. Please try again.",
      ),
      data: null,
    };
  }
};

export const togglePropertyFeatured = async (propertyId: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BACKEND_URL) {
      throw new Error("API URL not configured");
    }

    const cookieStore = await cookies();
    const url = `${BACKEND_URL}/api/v1/properties/featured/${propertyId}`;

    const response = await fetch(url, {
      method: "PATCH",
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
          "Could not update featured status. Please try again.",
        ),
      );
    }

    const data: { success: boolean; message: string; data: PropertyResponse } =
      await response.json();
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Could not update featured status. Please try again.",
      ),
      data: null,
    };
  }
};
