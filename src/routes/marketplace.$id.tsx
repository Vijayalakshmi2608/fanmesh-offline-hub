import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMarketplaceStore } from "@/stores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Wallet, MessageCircle, Heart, Star, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MarketplaceService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/marketplace/$id")({
  head: () => ({ meta: [{ title: "Item â€” FanMesh AI" }] }),
  component: ProductDetail,
  notFoundComponent: () => <div className="p-8">Item not found.</div>,
});

function ProductDetail() {
  const params = Route.useParams();
  const wishlist = useMarketplaceStore((state) => state.wishlist);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const addToCart = useMarketplaceStore((state) => state.addToCart);

  const productQuery = useQuery({
    queryKey: ["marketplace", "product", params.id],
    queryFn: () => MarketplaceService.getProductById(params.id),
    staleTime: 60_000,
  });
  const relatedQuery = useQuery({
    queryKey: ["marketplace", "related", params.id],
    queryFn: async () => {
      const products = await MarketplaceService.getProducts();
      const product = products.find((item) => item.id === params.id);
      return product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4) : [];
    },
    enabled: productQuery.isSuccess && Boolean(productQuery.data),
    staleTime: 60_000,
  });
  const [img, setImg] = useState("");

  useEffect(() => {
    if (productQuery.data) {
      setImg(productQuery.data.images?.[0] ?? productQuery.data.image);
    }
  }, [productQuery.data]);

  if (productQuery.isLoading) return <ProductSkeleton />;
  if (productQuery.isError) return <ProductError />;

  const product = productQuery.data;
  if (!product) throw notFound();
  const related = relatedQuery.data ?? [];

  return (
    <div>
      <Link to="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Back to marketplace
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={img} className="aspect-square rounded-3xl overflow-hidden glass">
            <img src={img} alt={product.title} className="size-full object-cover" />
          </motion.div>
          <div className="mt-3 flex gap-2">
            {product.images?.map((image) => (
              <button key={image} onClick={() => setImg(image)} className={`size-20 rounded-xl overflow-hidden border-2 ${image === img ? "border-primary" : "border-transparent"}`}>
                <img src={image} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Badge className="rounded-full">{product.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight mt-3">{product.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <div className="flex items-center gap-1 text-warning"><Star className="size-4 fill-current" />{product.rating}</div>
            <span className="text-muted-foreground">Â· {product.condition}</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <div className="text-4xl font-extrabold text-gradient">${product.price}</div>
            <div className="text-xs text-muted-foreground">{product.currency} Â· paid via FanMesh Wallet</div>
          </div>

          <Card className="glass rounded-2xl p-4 mt-5 border-0 flex items-center gap-3">
            <Avatar className="size-11"><AvatarImage src={product.sellerAvatar} /><AvatarFallback>{product.seller[0]}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="font-semibold">{product.seller}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="size-3 text-primary" /> Verified seller Â· Mesh ID confirmed</div>
            </div>
            <Button variant="outline" className="rounded-full"><MessageCircle className="size-4 mr-1.5" /> Chat</Button>
          </Card>

          <div className="mt-5">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="flex-1 rounded-full gradient-primary text-primary-foreground shadow-glow h-12 text-base" onClick={() => addToCart(product.id)}>
              <Wallet className="size-4 mr-2" /> Buy with Wallet
            </Button>
            <Button variant="outline" size="icon" className="rounded-full size-12" onClick={() => toggleWishlist(product.id)}>
              <Heart className={`size-5 ${wishlist.has(product.id) ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Related items</h2>
        {related.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => (
              <Link key={item.id} to="/marketplace/$id" params={{ id: item.id }}>
                <Card className="glass rounded-2xl border-0 overflow-hidden hover:-translate-y-1 transition">
                  <div className="aspect-square"><img src={item.image} alt={item.title} className="size-full object-cover" /></div>
                  <div className="p-3">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-sm font-bold text-gradient">${item.price}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No related items found.</div>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-40 rounded-full" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4 rounded-2xl" />
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProductError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load product details.</div>;
}
