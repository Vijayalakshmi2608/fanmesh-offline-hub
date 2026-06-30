import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/stores";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Pin, Mic, Image as ImageIcon, Send, Smile, Languages, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Offline Chat â€” FanMesh AI" }] }),
  component: Chat,
});

function Chat() {
  const queryClient = useQueryClient();
  const conversationsQuery = useQuery({
    queryKey: ["chats", "conversations"],
    queryFn: () => ChatService.getChats(),
    staleTime: 60_000,
  });
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const draftMessage = useChatStore((state) => state.draftMessage);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const updateDraft = useChatStore((state) => state.updateDraft);

  const messagesQuery = useQuery({
    queryKey: ["chats", "messages", selectedConversationId],
    queryFn: () => ChatService.getMessages(selectedConversationId ?? undefined),
    enabled: Boolean(selectedConversationId),
    staleTime: 60_000,
  });

  const sendMutation = useMutation({
    mutationFn: ({ text, conversationId }: { text: string; conversationId: string }) =>
      ChatService.sendMessage(text, conversationId),
    onSuccess: (message) => {
      queryClient.setQueryData(["chats", "messages", message.conversationId], (current: unknown) => {
        const items = Array.isArray(current) ? current : [];
        return [...items, message];
      });
      queryClient.setQueryData(["chats", "conversations"], (current: unknown) => {
        if (!Array.isArray(current)) return current;
        return current.map((conversation) =>
          conversation.id === message.conversationId
            ? { ...conversation, lastMessage: message.text, time: "now", unread: 0 }
            : conversation,
        );
      });
      updateDraft("");
    },
  });

  if (conversationsQuery.isLoading || messagesQuery.isLoading) {
    return <ChatSkeleton />;
  }

  if (conversationsQuery.isError || messagesQuery.isError) {
    return <ChatError />;
  }

  const conversations = conversationsQuery.data ?? [];
  const msgs = messagesQuery.data ?? [];
  const conv = conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0];

  if (!conversations.length || !conv) {
    return <ChatEmpty />;
  }

  return (
    <div className="h-[calc(100vh-9rem)] grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4">
      <aside className="glass rounded-2xl overflow-hidden flex flex-col min-h-0">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search chats" className="pl-9 rounded-full bg-secondary/40" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition border-l-2",
                conversation.id === selectedConversationId ? "bg-secondary/40 border-primary" : "border-transparent",
              )}
            >
              <Avatar className="size-11">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium truncate">{conversation.name}</span>
                  {conversation.pinned && <Pin className="size-3 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  {conversation.typing ? <span className="text-primary">typingâ€¦</span> : conversation.lastMessage}
                  {conversation.translated && <Badge variant="outline" className="ml-1 h-4 px-1.5 text-[9px]">EN</Badge>}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground flex flex-col items-end gap-1">
                <span>{conversation.time}</span>
                {conversation.unread > 0 && (
                  <span className="size-5 rounded-full gradient-primary text-primary-foreground grid place-items-center text-[10px] font-semibold">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="glass rounded-2xl flex flex-col min-h-0">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={conv.avatar} />
            <AvatarFallback>{conv.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{conv.name}</div>
            <div className="text-xs text-primary">online Â· mesh relay</div>
          </div>
          <Button variant="ghost" size="icon"><Phone className="size-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="size-4" /></Button>
          <Button variant="ghost" size="icon"><MoreVertical className="size-4" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {msgs.length ? (
            msgs.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                className={cn("flex", message.author === "me" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 relative",
                    message.author === "me" ? "gradient-primary text-primary-foreground rounded-br-sm" : "glass-strong rounded-bl-sm",
                  )}
                >
                  {message.type === "voice" ? (
                    <div className="flex items-center gap-2"><Mic className="size-4" /><div className="h-1 w-32 rounded-full bg-current opacity-40" /><span className="text-xs">0:14</span></div>
                  ) : message.type === "image" ? (
                    <div className="size-32 rounded-lg bg-secondary grid place-items-center"><ImageIcon className="size-6 opacity-50" /></div>
                  ) : (
                    <div className="text-sm">{message.text}</div>
                  )}
                  <div className={cn("flex items-center gap-1 mt-1 text-[10px] opacity-70", message.author === "me" ? "justify-end" : "")}>
                    {message.translated && <Badge variant="outline" className="h-4 px-1.5 text-[9px] border-current"><Languages className="size-2.5 mr-0.5" />Translated</Badge>}
                    <span>{message.time}</span>
                    {message.author === "me" && (i % 2 ? <CheckCheck className="size-3" /> : <Check className="size-3" />)}
                  </div>
                  {message.reactions && <div className="absolute -bottom-2 -right-1 text-xs">{message.reactions.join("")}</div>}
                </div>
              </motion.div>
            ))
          ) : (
            <ChatEmptyMessages />
          )}
        </div>

        <div className="p-3 border-t border-border flex items-center gap-2">
          <Button variant="ghost" size="icon"><Smile className="size-5" /></Button>
          <Button variant="ghost" size="icon"><ImageIcon className="size-5" /></Button>
          <Input
            value={draftMessage}
            onChange={(e) => updateDraft(e.target.value)}
            placeholder="Type a messageâ€¦"
            className="flex-1 rounded-full bg-secondary/40"
          />
          <Button variant="ghost" size="icon"><Mic className="size-5" /></Button>
          <Button
            size="icon"
            className="rounded-full gradient-primary text-primary-foreground shadow-glow"
            onClick={() => {
              if (!draftMessage || !selectedConversationId || sendMutation.isPending) return;
              sendMutation.mutate({ text: draftMessage, conversationId: selectedConversationId });
            }}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-9rem)] grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4">
      <div className="glass rounded-2xl p-4 space-y-4">
        <Skeleton className="h-10 rounded-full" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4 flex flex-col gap-4">
        <Skeleton className="h-16 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-20 w-3/5 rounded-2xl ml-auto" />
          <Skeleton className="h-20 w-2/5 rounded-2xl" />
          <Skeleton className="h-20 w-3/5 rounded-2xl ml-auto" />
        </div>
        <Skeleton className="h-14 rounded-full" />
      </div>
    </div>
  );
}

function ChatError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load chat.</div>;
}

function ChatEmpty() {
  return <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No conversations available.</div>;
}

function ChatEmptyMessages() {
  return <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No messages in this conversation.</div>;
}
