import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  feedback?: "helpful" | "not_helpful";
}

interface ChatStore {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;

  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setError: (error: string | null) => void;
  addFeedback: (messageId: string, feedback: "helpful" | "not_helpful") => void;
  getMessages: () => ChatMessage[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isOpen: false,
      error: null,

      addMessage: (message: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      addFeedback: (messageId: string, feedback: "helpful" | "not_helpful") => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, feedback } : msg,
          ),
        }));
      },

      getMessages: () => get().messages,
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        messages: state.messages,
      }),
    },
  ),
);
