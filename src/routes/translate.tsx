import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useTranslationStore } from "@/stores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowLeftRight, Mic, Sparkles, Copy } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/translate")({
  head: () => ({ meta: [{ title: "AI Translation — FanMesh AI" }] }),
  component: Translate,
});

const LANGS = ["English", "Spanish", "Portuguese", "French", "German", "Italian", "Arabic", "Japanese", "Korean", "Dutch"];
const RECENT = [
  { from: "ES", to: "EN", src: "¡Vamos equipo!", out: "Let's go team!" },
  { from: "PT", to: "EN", src: "Onde fica a saída?", out: "Where is the exit?" },
  { from: "FR", to: "EN", src: "Quel beau but!", out: "What a beautiful goal!" },
  { from: "JA", to: "EN", src: "席はどこですか？", out: "Where is my seat?" },
];

function Translate() {
  const sourceLang = useTranslationStore((state) => state.sourceLang);
  const targetLang = useTranslationStore((state) => state.targetLang);
  const originalText = useTranslationStore((state) => state.originalText);
  const translatedText = useTranslationStore((state) => state.translatedText);
  const setSourceLanguage = useTranslationStore((state) => state.setSourceLanguage);
  const setTargetLanguage = useTranslationStore((state) => state.setTargetLanguage);
  const translate = useTranslationStore((state) => state.translate);
  const swapLanguages = useTranslationStore((state) => state.swapLanguages);
  
  return (
    <div>
      <PageHeader icon={<Languages className="size-5" />} title="AI Translation" subtitle="On-device QVAC translation · works offline" />

      <Card className="glass rounded-3xl p-6 border-0">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
          <div className="space-y-3">
            <Select value={sourceLang} onValueChange={setSourceLanguage}>
              <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <Textarea value={originalText} onChange={(e) => translate(e.target.value)} className="min-h-[180px] rounded-2xl text-lg bg-secondary/30" />
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full"><Mic className="size-4 mr-1.5" /> Speak</Button>
              <Button variant="ghost" className="rounded-full"><Copy className="size-4" /></Button>
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-center">
            <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="size-12 rounded-full gradient-primary text-primary-foreground grid place-items-center shadow-glow"
              onClick={swapLanguages}>
              <ArrowLeftRight className="size-5" />
            </motion.button>
          </div>

          <div className="space-y-3">
            <Select value={targetLang} onValueChange={setTargetLanguage}>
              <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={originalText + targetLang}
              className="min-h-[180px] rounded-2xl p-4 glass-strong relative">
              <Sparkles className="size-4 text-primary absolute top-3 right-3" />
              <div className="text-lg">{translatedText || "Translation appears here…"}</div>
            </motion.div>
            <div className="text-xs text-muted-foreground">Detected confidence: 98% · QVAC on-device</div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Recent Translations</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {RECENT.map((r, i) => (
            <Card key={i} className="glass rounded-2xl p-4 border-0 hover:shadow-glow transition">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-primary">{r.from} → {r.to}</span>
                <span>just now</span>
              </div>
              <div className="mt-2 text-sm">{r.src}</div>
              <div className="mt-1 text-sm font-medium">{r.out}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
