import { create } from "zustand";
import { Conversation, Message } from "@/types";
import { CONVERSATIONS, MESSAGES } from "@/mock";

interface ChatStore {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Message[];
  draftMessage: string;
  typingUsers: string[];
  attachments: Array<{ id: string; url: string; type: string }>;

  selectConversation: (conversationId: string) => void;
  sendMessage: (text: string, conversationId: string) => void;
  receiveMessage: (message: Message) => void;
  markAsRead: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  updateDraft: (text: string) => void;
  clearDraft: () => void;
  setTypingUsers: (userIds: string[]) => void;
  addAttachment: (id: string, url: string, type: string) => void;
  removeAttachment: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: CONVERSATIONS,
  selectedConversationId: CONVERSATIONS[0]?.id || null,
  messages: MESSAGES,
  draftMessage: "",
  typingUsers: [],
  attachments: [],

  selectConversation: (conversationId) =>
    set({ selectedConversationId: conversationId }),

  sendMessage: (text, conversationId) => {
    const messageId = `m-${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      conversationId,
      author: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
      draftMessage: "",
      attachments: [],
    }));
  },

  receiveMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: 0 } : c
      ),
    })),

  deleteConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
      selectedConversationId:
        state.selectedConversationId === conversationId
          ? state.conversations[0]?.id || null
          : state.selectedConversationId,
      messages: state.messages.filter(
        (m) => m.conversationId !== conversationId
      ),
    })),

  updateDraft: (text) => set({ draftMessage: text }),

  clearDraft: () => set({ draftMessage: "" }),

  setTypingUsers: (userIds) => set({ typingUsers: userIds }),

  addAttachment: (id, url, type) =>
    set((state) => ({
      attachments: [...state.attachments, { id, url, type }],
    })),

  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
    })),
}));

// Selectors
export const selectConversations = (state: ChatStore) => state.conversations;
export const selectSelectedConversation = (state: ChatStore) => {
  const id = state.selectedConversationId;
  return state.conversations.find((c) => c.id === id) || null;
};
export const selectMessages = (state: ChatStore) => state.messages;
export const selectMessagesByConversation = (
  conversationId: string
) => (state: ChatStore) => state.messages.filter((m) => m.conversationId === conversationId);
export const selectDraftMessage = (state: ChatStore) => state.draftMessage;
export const selectTypingUsers = (state: ChatStore) => state.typingUsers;
