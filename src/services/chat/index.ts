import type { Conversation, Message } from "@/types";
import { CONVERSATIONS, MESSAGES } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

let conversations = cloneMock(CONVERSATIONS);
let messages = cloneMock(MESSAGES);

export const ChatService = {
  // TODO: Replace ChatService with Pears Stack
  async getChats(): Promise<Conversation[]> {
    return withMockLatency(() => cloneMock(conversations));
  },

  // TODO: Replace ChatService with Pears Stack
  async getMessages(conversationId?: string): Promise<Message[]> {
    return withMockLatency(() => {
      const list = conversationId
        ? messages.filter((message) => message.conversationId === conversationId)
        : messages;
      return cloneMock(list);
    });
  },

  // TODO: Replace ChatService with Pears Stack
  async sendMessage(text: string, conversationId: string): Promise<Message> {
    return withMockLatency(() => {
      const message: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        author: "me",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      messages = [...messages, message];
      conversations = conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, lastMessage: text, time: "now", unread: 0 }
          : conversation,
      );
      return cloneMock(message);
    });
  },
};
