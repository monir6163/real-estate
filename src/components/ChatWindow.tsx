"use client";

import { saveChatFeedback, streamChat } from "@/actions/chat";
import { ChatMessage as MessageType, useChatStore } from "@/store/useChatStore";
import { Send, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

export const ChatWindow = () => {
  const {
    messages,
    isLoading,
    isOpen,
    setOpen,
    addMessage,
    setLoading,
    addFeedback,
  } = useChatStore();
  const [inputValue, setInputValue] = React.useState("");
  const [typingIndicator, setTypingIndicator] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingIndicator]);

  const handleSuggestedMessage = async (messageText: string) => {
    setLoading(true);
    setTypingIndicator(true);

    try {
      const allMessages = [
        ...messages
          .filter((m) => m.role !== "assistant" || m.content.length > 0)
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
        { role: "user" as const, content: messageText },
      ];

      const response = await streamChat({ messages: allMessages });

      if (!response) {
        throw new Error("No response from server");
      }

      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      const reader = response.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);

              if (data.type === "complete") {
                assistantMessage.content = fullContent;
                addMessage(assistantMessage);
                setTypingIndicator(false);
                break;
              }

              if (data.content) {
                fullContent += data.content;
                if (firstChunk) {
                  assistantMessage.content = fullContent;
                  addMessage(assistantMessage);
                  firstChunk = false;
                }
              }
            } catch (e) {
              // Ignore parse errors in streaming
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      setTypingIndicator(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInputValue("");
    setLoading(true);
    setTypingIndicator(true);

    try {
      const response = await streamChat({
        messages: messages
          .filter((m) => m.role !== "assistant" || m.content.length > 0)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }))
          .concat([{ role: "user", content: inputValue }]),
      });

      if (!response) {
        throw new Error("No response from server");
      }

      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      const reader = response.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);

              if (data.type === "complete") {
                assistantMessage.content = fullContent;
                addMessage(assistantMessage);
                setTypingIndicator(false);
                break;
              }

              if (data.content) {
                fullContent += data.content;
                if (firstChunk) {
                  assistantMessage.content = fullContent;
                  addMessage(assistantMessage);
                  firstChunk = false;
                } else {
                  // Update the last message with new content
                  const lastMessage = messages[messages.length - 1];
                  if (lastMessage?.id === assistantMessage.id) {
                    lastMessage.content = fullContent;
                  }
                }
              }
            } catch (e) {
              // Ignore parse errors in streaming
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      setTypingIndicator(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.93l-1.38 1.04a1 1 0 01-1.54-.82v-.82H4a2 2 0 01-2-2V5z"></path>
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 w-96 h-[600px] bg-white dark:bg-slate-950 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Smart Property Assistant</h3>
          <p className="text-xs text-blue-100">Always here to help</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="hover:bg-blue-800 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
                Hi! I'm your AI assistant. Ask me anything about properties,
                bookings, or payments.
              </p>
            </div>

            {/* Suggestion Prompts */}
            <div className="grid grid-cols-1 gap-2 w-full">
              <button
                onClick={() => {
                  const message = "আমার প্রপার্টিজ কী?";
                  const userMessage: MessageType = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: Date.now(),
                  };
                  addMessage(userMessage);
                  handleSuggestedMessage(message);
                }}
                className="p-3 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  🏠 আমার প্রপার্টিজ
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  আমার লিস্ট করা প্রপার্টিজ দেখুন
                </p>
              </button>

              <button
                onClick={() => {
                  const message = "আমার বুকিংস কী?";
                  const userMessage: MessageType = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: Date.now(),
                  };
                  addMessage(userMessage);
                  handleSuggestedMessage(message);
                }}
                className="p-3 bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                  📅 আমার বুকিংস
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  বুকিং স্ট্যাটাস এবং বিবরণ
                </p>
              </button>

              <button
                onClick={() => {
                  const message = "নতুন প্রপার্টি কীভাবে লিস্ট করব?";
                  const userMessage: MessageType = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: Date.now(),
                  };
                  addMessage(userMessage);
                  handleSuggestedMessage(message);
                }}
                className="p-3 bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  ➕ নতুন প্রপার্টি
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  প্রপার্টি লিস্ট করার ধাপ
                </p>
              </button>

              <button
                onClick={() => {
                  const message = "পেমেন্ট অপশন কী আছে?";
                  const userMessage: MessageType = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: Date.now(),
                  };
                  addMessage(userMessage);
                  handleSuggestedMessage(message);
                }}
                className="p-3 bg-orange-50 dark:bg-slate-800 border border-orange-200 dark:border-orange-700 rounded-lg hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  💳 পেমেন্ট অপশন
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  পেমেন্ট পদ্ধতি এবং তথ্য
                </p>
              </button>

              <button
                onClick={() => {
                  const message = "বুকিং ক্যান্সেল করব কীভাবে?";
                  const userMessage: MessageType = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: Date.now(),
                  };
                  addMessage(userMessage);
                  handleSuggestedMessage(message);
                }}
                className="p-3 bg-red-50 dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  ❌ বুকিং ক্যান্সেল
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ক্যান্সেল প্রক্রিয়া এবং রিফান্ড
                </p>
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Feedback buttons for assistant messages */}
                  {message.role === "assistant" && !message.feedback && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                      <button
                        onClick={() => {
                          addFeedback(message.id, "helpful");
                          saveChatFeedback({
                            messageId: message.id,
                            feedback: "helpful",
                          }).catch((err) =>
                            console.error("Failed to save feedback:", err),
                          );
                          toast.success("Thanks for your feedback!");
                        }}
                        className="text-xs hover:bg-green-500/20 px-2 py-1 rounded transition-colors"
                        title="Helpful"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => {
                          addFeedback(message.id, "not_helpful");
                          saveChatFeedback({
                            messageId: message.id,
                            feedback: "not_helpful",
                          }).catch((err) =>
                            console.error("Failed to save feedback:", err),
                          );
                          toast.success("Thanks for your feedback!");
                        }}
                        className="text-xs hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
                        title="Not helpful"
                      >
                        👎
                      </button>
                    </div>
                  )}

                  {message.feedback && (
                    <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      {message.feedback === "helpful"
                        ? "👍 Helpful"
                        : "👎 Not helpful"}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typingIndicator && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-slate-950 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
