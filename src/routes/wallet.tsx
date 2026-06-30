import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownLeft, ArrowUpRight, QrCode, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { WalletService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet â€” FanMesh AI" }] }),
  component: WalletPage,
});

function WalletPage() {
  const balanceQuery = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => WalletService.getBalance(),
    staleTime: 60_000,
  });
  const transactionsQuery = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () => WalletService.getTransactions(),
    staleTime: 60_000,
  });

  if (balanceQuery.isLoading || transactionsQuery.isLoading) return <WalletSkeleton />;
  if (balanceQuery.isError || transactionsQuery.isError) return <WalletError />;

  const balance = balanceQuery.data ?? 0;
  const transactions = transactionsQuery.data ?? [];
  const income = transactions.filter((transaction) => transaction.type === "in").reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = transactions.filter((transaction) => transaction.type === "out").reduce((sum, transaction) => sum + transaction.amount, 0);
  const chart = Array.from({ length: 14 }, (_, i) => ({ d: `D${i + 1}`, v: 800 + Math.round(Math.sin(i) * 120 + Math.random() * 200) }));

  return (
    <div>
      <PageHeader icon={<Wallet className="size-5" />} title="Wallet" subtitle="Local WDK wallet Â· settles via mesh when online" />

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl p-8 gradient-hero shadow-elegant overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Total Balance</div>
            <div className="text-5xl font-extrabold mt-2">${balance.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">≈ 0.0184 BTC Â· WDK secured</div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button className="rounded-full gradient-primary text-primary-foreground"><ArrowDownLeft className="size-4 mr-1.5" /> Receive</Button>
              <Button variant="outline" className="rounded-full"><ArrowUpRight className="size-4 mr-1.5" /> Send</Button>
              <Button variant="outline" className="rounded-full"><QrCode className="size-4 mr-1.5" /> QR</Button>
            </div>
            <div className="mt-6 grid place-items-center">
              <div className="size-40 rounded-2xl glass-strong grid place-items-center">
                <div className="size-32 rounded-xl bg-background grid place-items-center">
                  <QrCode className="size-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 content-start">
          <Card className="glass rounded-2xl p-5 border-0">
            <div className="text-xs uppercase text-muted-foreground">Income</div>
            <div className="text-2xl font-bold mt-1 text-primary flex items-center gap-1"><TrendingUp className="size-5" />${income}</div>
          </Card>
          <Card className="glass rounded-2xl p-5 border-0">
            <div className="text-xs uppercase text-muted-foreground">Expenses</div>
            <div className="text-2xl font-bold mt-1 text-destructive flex items-center gap-1"><TrendingDown className="size-5" />${expense}</div>
          </Card>
          <Card className="glass rounded-2xl p-5 border-0 col-span-2">
            <div className="text-xs uppercase text-muted-foreground mb-2">14-day flow</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="oklch(0.7 0.02 160)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.02 160)", border: "1px solid oklch(0.3 0.02 160)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.72 0.18 150)" fill="url(#wg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Card className="glass rounded-2xl p-5 border-0 mt-6">
        <div className="font-semibold mb-2">Transaction History</div>
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl grid place-items-center ${transaction.type === "in" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                  {transaction.type === "in" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium">{transaction.party}</div>
                  <div className="text-xs text-muted-foreground">{transaction.note} Â· {transaction.time}</div>
                </div>
              </div>
              <div className={`font-semibold tabular-nums ${transaction.type === "in" ? "text-primary" : "text-destructive"}`}>
                {transaction.type === "in" ? "+" : "-"}${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-72 rounded-2xl" />
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

function WalletError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load wallet data.</div>;
}
