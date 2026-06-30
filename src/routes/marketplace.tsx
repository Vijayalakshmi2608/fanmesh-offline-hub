import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useMarketplaceStore } from "@/stores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, Heart, Star, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — FanMesh AI" }] }),
  component: Marketplace,
});

const CATS = ["All", "Tickets", "Jerseys", "Scarves", "Food Coupons", "Collectibles"] as const;

function Marketplace() {
  const selectedCategory = useMarketplaceStore((state) => state.selectedCategory);
  const searchQuery = useMarketplaceStore((state) => state.searchQuery);
  const filterCategory = useMarketplaceStore((state) => state.filterCategory);
  const searchProducts = useMarketplaceStore((state) => state.searchProducts);
  const getFilteredProducts = useMarketplaceStore((state) => state.getFilteredProducts);
  
  const items = getFilteredProducts();

  return (
    <div>
      <PageHeader
        icon={<ShoppingBag className="size-5" />}
        title="Marketplace"
        subtitle="Fan-to-fan items via the local mesh"
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => searchProducts(e.target.value)} placeholder="Search items" className="pl-9 rounded-full w-64" />
            </div>
            <Button variant="outline" className="rounded-full"><SlidersHorizontal className="size-4 mr-1.5" /> Filters</Button>
          </>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        {CATS.map((c) => (
          <button key={c} onClick={() => filterCategory(c)}
            className={cn("rounded-full px-4 py-2 text-sm font-medium transition shrink-0",
              selectedCategory === c ? "gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-secondary/60")}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} whileHover={{ y: -4 }}>
            <Link to="/marketplace/$id" params={{ id: p.id }}>
              <Card className="glass rounded-2xl border-0 overflow-hidden h-full group">
                <div className="relative aspect-square bg-secondary overflow-hidden">
                  <img src={p.image} alt={p.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-2 right-2 size-9 rounded-full glass-strong grid place-items-center" aria-label="Wishlist">
                    <Heart className="size-4" />
                  </button>
                  <Badge className="absolute top-2 left-2 rounded-full bg-background/60 border-0 text-foreground">{p.category}</Badge>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm truncate">{p.title}</div>
                    <div className="text-sm flex items-center gap-1 text-warning shrink-0"><Star className="size-3 fill-current" />{p.rating}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-lg font-bold text-gradient">${p.price}</div>
                    <Badge variant="outline" className="text-[10px]">{p.condition}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Avatar className="size-6"><AvatarImage src={p.sellerAvatar} /><AvatarFallback>{p.seller[0]}</AvatarFallback></Avatar>
                    <span className="text-xs text-muted-foreground truncate">{p.seller}</span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
