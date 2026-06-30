import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, Languages, Bell, Palette, Shield, Download, Database, Sparkles, Wallet, Info } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FanMesh AI" }] }),
  component: SettingsPage,
});

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="glass rounded-2xl p-5 border-0">
      <div className="font-semibold flex items-center gap-2 mb-4">
        <div className="size-9 rounded-xl gradient-primary text-primary-foreground grid place-items-center shadow-glow">{icon}</div>
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </Card>
  );
}

function Row({ label, hint, control }: { label: string; hint?: string; control: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <PageHeader icon={<Settings className="size-5" />} title="Settings" subtitle="Tune FanMesh AI for your stadium experience" />

      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={<Languages className="size-4" />} title="Language">
          <Row label="App language" control={
            <Select defaultValue="English"><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{["English", "Spanish", "Portuguese", "French", "German", "Arabic"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          } />
          <Row label="Auto-translate incoming chats" hint="On-device, no internet required" control={<Switch defaultChecked />} />
        </Section>

        <Section icon={<Bell className="size-4" />} title="Notifications">
          <Row label="Emergency alerts" control={<Switch defaultChecked />} />
          <Row label="Chat messages" control={<Switch defaultChecked />} />
          <Row label="Marketplace offers" control={<Switch defaultChecked />} />
          <Row label="Wallet activity" control={<Switch />} />
        </Section>

        <Section icon={<Palette className="size-4" />} title="Theme">
          <Row label="Color scheme" control={
            <Select defaultValue="Dark"><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{["Dark", "System"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          } />
          <Row label="Reduced motion" control={<Switch />} />
        </Section>

        <Section icon={<Shield className="size-4" />} title="Privacy">
          <Row label="Discoverable on mesh" control={<Switch defaultChecked />} />
          <Row label="Share approximate location" control={<Switch defaultChecked />} />
          <Row label="End-to-end encrypted chats" control={<Switch defaultChecked />} />
        </Section>

        <Section icon={<Download className="size-4" />} title="Downloads & Storage">
          <Row label="Auto-download images" control={<Switch />} />
          <Row label="Cache size" hint="280 MB of 2 GB used"
               control={<div className="w-40"><Slider defaultValue={[14]} max={100} /></div>} />
        </Section>

        <Section icon={<Database className="size-4" />} title="Offline Storage">
          <Row label="Keep messages for" control={
            <Select defaultValue="30 days"><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{["7 days", "30 days", "90 days", "Forever"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          } />
          <Row label="Sync via Pears relay" control={<Switch defaultChecked />} />
        </Section>

        <Section icon={<Sparkles className="size-4" />} title="AI Preferences">
          <Row label="QVAC on-device summaries" control={<Switch defaultChecked />} />
          <Row label="Smart translation" control={<Switch defaultChecked />} />
          <Row label="Insight intensity" hint="How aggressive AI suggestions should be"
               control={<div className="w-40"><Slider defaultValue={[60]} max={100} /></div>} />
        </Section>

        <Section icon={<Wallet className="size-4" />} title="Wallet">
          <Row label="Require PIN for payments" control={<Switch defaultChecked />} />
          <Row label="Default currency" control={
            <Select defaultValue="USD"><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{["USD", "EUR", "BTC"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          } />
        </Section>

        <Section icon={<Info className="size-4" />} title="About">
          <div className="text-sm text-muted-foreground">FanMesh AI v0.1.0 · Built for offline stadium experiences. Ready for Pears Stack, QVAC SDK and WDK integration.</div>
        </Section>
      </div>
    </div>
  );
}
