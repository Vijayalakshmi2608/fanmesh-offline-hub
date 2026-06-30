import { createFileRoute } from "@tanstack/react-router";
import { useChatStore } from "@/stores";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Pin, Mic, Image as ImageIcon, Send, Smile, Languages, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Offline Chat — FanMesh AI" }] }),
  component: Chat,
});

function Chat() {
  const conversations = useChatStore((state) => state.conversations);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const messages = useChatStore((state) => state.messages);
  const draftMessage = useChatStore((state) => state.draftMessage);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const updateDraft = useChatStore((state) => state.updateDraft);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const conv = conversations.find((c) => c.id === selectedConversationId)!;
  const msgs = messages.filter((m) => m.conversationId === selectedConversationId).slice(0, 30);

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
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={cn("w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition border-l-2",
                c.id === selectedConversationId ? "bg-secondary/40 border-primary" : "border-transparent")}
            >
              <Avatar className="size-11"><AvatarImage src={c.avatar} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium truncate">{c.name}</span>
                  {c.pinned && <Pin className="size-3 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  {c.typing ? <span className="text-primary">typing…</span> : c.lastMessage}
                  {c.translated && <Badge variant="outline" className="ml-1 h-4 px-1.5 text-[9px]">EN</Badge>}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground flex flex-col items-end gap-1">
                <span>{c.time}</span>
                {c.unread > 0 && <span className="size-5 rounded-full gradient-primary text-primary-foreground grid place-items-center text-[10px] font-semibold">{c.unread}</span>}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="glass rounded-2xl flex flex-col min-h-0">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Avatar className="size-10"><AvatarImage src={conv.avatar} /><AvatarFallback>{conv.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{conv.name}</div>
            <div className="text-xs text-primary">online · mesh relay</div>
          </div>
          <Button variant="ghost" size="icon"><Phone className="size-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="size-4" /></Button>
          <Button variant="ghost" size="icon"><MoreVertical className="size-4" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {msgs.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
              className={cn("flex", m.author === "me" ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 relative",
                m.author === "me" ? "gradient-primary text-primary-foreground rounded-br-sm" : "glass-strong rounded-bl-sm"
              )}>
                {m.type === "voice" ? (
                  <div className="flex items-center gap-2"><Mic className="size-4" /><div className="h-1 w-32 rounded-full bg-current opacity-40" /><span className="text-xs">0:14</span></div>
                ) : m.type === "image" ? (
                  <div className="size-32 rounded-lg bg-secondary grid place-items-center"><ImageIcon className="size-6 opacity-50" /></div>
                ) : (
                  <div className="text-sm">{m.text}</div>
                )}
                <div className={cn("flex items-center gap-1 mt-1 text-[10px] opacity-70", m.author === "me" ? "justify-end" : "")}>
                  {m.translated && <Badge variant="outline" className="h-4 px-1.5 text-[9px] border-current"><Languages className="size-2.5 mr-0.5" />Translated</Badge>}
                  <span>{m.time}</span>
                  {m.author === "me" && (i % 2 ? <CheckCheck className="size-3" /> : <Check className="size-3" />)}
                </div>
                {m.reactions && <div className="absolute -bottom-2 -right-1 text-xs">{m.reactions.join("")}</div>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-3 border-t border-border flex items-center gap-2">
          <Button variant="ghost" size="icon"><Smile className="size-5" /></Button>
          <Button variant="ghost" size="icon"><ImageIcon className="size-5" /></Button>
          <Input value={draftMessage} onChange={(e) => updateDraft(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-full bg-secondary/40" />
          <Button variant="ghost" size="icon"><Mic className="size-5" /></Button>
          <Button size="icon" className="rounded-full gradient-primary text-primary-foreground shadow-glow" onClick={() => { if (draftMessage && selectedConversationId) sendMessage(draftMessage, selectedConversationId); }}><Send className="size-4" /></Button>
        </div>
      </section>
    </div>
  );
}
