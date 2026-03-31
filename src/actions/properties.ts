"use server";

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
    if (filters?.minPrice)
      params.append("price[gte]", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("price[lte]", filters.maxPrice.toString());
    if (filters?.bedrooms)
      params.append("bedrooms", filters.bedrooms.toString());
    if (filters?.bathrooms)
      params.append("bathrooms", filters.bathrooms.toString());
    if (filters?.location) params.append("location", filters.location);

    const url = `${BACKEND_URL}/api/v1/properties${params.toString() ? "?" + params.toString() : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      throw new Error(`Failed to fetch property: ${response.status}`);
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
      error: error instanceof Error ? error.message : "Unknown error",
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
    if (filters?.minPrice)
      params.append("price[gte]", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("price[lte]", filters.maxPrice.toString());
    if (filters?.bedrooms)
      params.append("bedrooms", filters.bedrooms.toString());
    if (filters?.bathrooms)
      params.append("bathrooms", filters.bathrooms.toString());
    if (filters?.location) params.append("location", filters.location);

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
        `Failed to fetch featured properties: ${response.status}`,
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      throw new Error(`Failed to fetch owner properties: ${response.status}`);
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

      error: error instanceof Error ? error.message : "Unknown error",
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to create property: ${response.status}`,
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
      message:
        error instanceof Error ? error.message : "Failed to create property",
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
      let errorMessage = "Failed to delete property";
      try {
        const error = await response.json();
        errorMessage =
          error.message || `Failed to delete property: ${response.status}`;
      } catch {
        errorMessage = `Failed to delete property: ${response.status}`;
      }
      throw new Error(errorMessage);
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
      message:
        error instanceof Error ? error.message : "Failed to delete property",
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
      const error = await response.json();
      throw new Error(
        error.message || `Failed to update property: ${response.status}`,
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
      message:
        error instanceof Error ? error.message : "Failed to update property",
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
      throw new Error(`Failed to fetch owner bookings: ${response.status}`);
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
      error: error instanceof Error ? error.message : "Unknown error",
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
      const error = await response.json();
      throw new Error(
        error.message || `Failed to update booking status: ${response.status}`,
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
      message:
        error instanceof Error
          ? error.message
          : "Failed to update booking status",
      data: null,
    };
  }
};
