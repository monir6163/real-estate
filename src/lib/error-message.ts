export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
};

const statusFallbackMap: Record<number, string> = {
  400: "Your request could not be processed. Please check the input and try again.",
  401: "Please sign in and try again.",
  403: "You do not have permission to perform this action.",
  404: "Requested resource was not found.",
  409: "This action conflicts with existing data.",
  413: "Uploaded file is too large. Please upload a smaller file.",
  422: "Some fields are invalid. Please review your input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error occurred. Please try again shortly.",
  502: "Service is temporarily unavailable. Please try again.",
  503: "Service is temporarily unavailable. Please try again.",
  504: "Server took too long to respond. Please try again.",
};

export const getHttpStatusMessage = (status: number, fallback?: string) => {
  if (fallback?.trim()) {
    return fallback;
  }

  return (
    statusFallbackMap[status] || "Request failed. Please try again in a moment."
  );
};

export const parseApiErrorMessage = async (
  response: Response,
  fallback?: string,
) => {
  try {
    const payload = await response.json();

    if (typeof payload?.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload?.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Ignore parse errors and use status-based fallback.
  }

  return getHttpStatusMessage(response.status, fallback);
};
