import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import { MarketplaceService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace â€” FanMesh AI" }] }),
  component: Marketplace,
});

const CATS = ["All", "Tickets", "Jerseys", "Scarves", "Food Coupons", "Collectibles"] as const;

function Marketplace() {
  const selectedCategory = useMarketplaceStore((state) => state.selectedCategory);
  const searchQuery = useMarketplaceStore((state) => state.searchQuery);
  const filterCategory = useMarketplaceStore((state) => state.filterCategory);
  const searchProducts = useMarketplaceStore((state) => state.searchProducts);

  const productsQuery = useQuery({
    queryKey: ["marketplace", "products"],
    queryFn: () => MarketplaceService.getProducts(),
    staleTime: 60_000,
  });

  if (productsQuery.isLoading) return <MarketplaceSkeleton />;
  if (productsQuery.isError) return <MarketplaceError />;

  const products = productsQuery.data ?? [];
  const items = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = !searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {CATS.map((category) => (
          <button
            key={category}
            onClick={() => filterCategory(category)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition shrink-0",
              selectedCategory === category ? "gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-secondary/60",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {!items.length ? (
        <MarketplaceEmpty />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }} whileHover={{ y: -4 }}>
              <Link to="/marketplace/$id" params={{ id: product.id }}>
                <Card className="glass rounded-2xl border-0 overflow-hidden h-full group">
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <img src={product.image} alt={product.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-2 right-2 size-9 rounded-full glass-strong grid place-items-center" aria-label="Wishlist">
                      <Heart className="size-4" />
                    </button>
                    <Badge className="absolute top-2 left-2 rounded-full bg-background/60 border-0 text-foreground">{product.category}</Badge>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm truncate">{product.title}</div>
                      <div className="text-sm flex items-center gap-1 text-warning shrink-0"><Star className="size-3 fill-current" />{product.rating}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-lg font-bold text-gradient">${product.price}</div>
                      <Badge variant="outline" className="text-[10px]">{product.condition}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar className="size-6"><AvatarImage src={product.sellerAvatar} /><AvatarFallback>{product.seller[0]}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground truncate">{product.seller}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-72 rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function MarketplaceError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load marketplace products.</div>;
}

function MarketplaceEmpty() {
  return <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No marketplace items match your filters.</div>;
}
