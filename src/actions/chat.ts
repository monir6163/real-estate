"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StreamChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  userRole?: "USER" | "AGENT" | "ADMIN";
}

export interface ChatFeedbackRequest {
  messageId: string;
  feedback: "helpful" | "not_helpful";
  comment?: string;
}

/**
 * Stream chat response from backend
 */
export const streamChat = async (request: StreamChatRequest) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to stream chat response");
    }

    // Return the response body as a readable stream
    return response.body;
  } catch (error) {
    console.error("Stream chat error:", error);
    throw error;
  }
};

/**
 * Save feedback on a chat response
 */
export const saveChatFeedback = async (request: ChatFeedbackRequest) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Save feedback error:", error);
    throw error;
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (limit = 50, offset = 0) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(
      `${BACKEND_URL}/api/v1/chat/history?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch chat history");
    }

    return await response.json();
  } catch (error) {
    console.error("Get history error:", error);
    throw error;
  }
};
