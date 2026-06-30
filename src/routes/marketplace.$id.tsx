import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Wallet, MessageCircle, Heart, Star, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/marketplace/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    return { meta: [{ title: `${p?.title ?? "Item"} — FanMesh AI` }] };
  },
  component: ProductDetail,
  notFoundComponent: () => <div className="p-8">Item not found.</div>,
  loader: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
});

function ProductDetail() {
  const p = Route.useLoaderData();
  const [img, setImg] = useState(p.images?.[0] ?? p.image);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div>
      <Link to="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Back to marketplace
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={img}
            className="aspect-square rounded-3xl overflow-hidden glass">
            <img src={img} alt={p.title} className="size-full object-cover" />
          </motion.div>
          <div className="mt-3 flex gap-2">
            {p.images?.map((i) => (
              <button key={i} onClick={() => setImg(i)} className={`size-20 rounded-xl overflow-hidden border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                <img src={i} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Badge className="rounded-full">{p.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight mt-3">{p.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <div className="flex items-center gap-1 text-warning"><Star className="size-4 fill-current" />{p.rating}</div>
            <span className="text-muted-foreground">· {p.condition}</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <div className="text-4xl font-extrabold text-gradient">${p.price}</div>
            <div className="text-xs text-muted-foreground">{p.currency} · paid via FanMesh Wallet</div>
          </div>

          <Card className="glass rounded-2xl p-4 mt-5 border-0 flex items-center gap-3">
            <Avatar className="size-11"><AvatarImage src={p.sellerAvatar} /><AvatarFallback>{p.seller[0]}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="font-semibold">{p.seller}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="size-3 text-primary" /> Verified seller · Mesh ID confirmed</div>
            </div>
            <Button variant="outline" className="rounded-full"><MessageCircle className="size-4 mr-1.5" /> Chat</Button>
          </Card>

          <div className="mt-5">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="flex-1 rounded-full gradient-primary text-primary-foreground shadow-glow h-12 text-base">
              <Wallet className="size-4 mr-2" /> Buy with Wallet
            </Button>
            <Button variant="outline" size="icon" className="rounded-full size-12"><Heart className="size-5" /></Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Related items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((r) => (
            <Link key={r.id} to="/marketplace/$id" params={{ id: r.id }}>
              <Card className="glass rounded-2xl border-0 overflow-hidden hover:-translate-y-1 transition">
                <div className="aspect-square"><img src={r.image} alt={r.title} className="size-full object-cover" /></div>
                <div className="p-3">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-sm font-bold text-gradient">${r.price}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
