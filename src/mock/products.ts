import type { Product } from "@/types";
import { createSeededRandom, FIRST_NAMES, LAST_NAMES, PRODUCT_IMAGES, TEAMS, pick } from "./shared";

const random = createSeededRandom(44);
const CATS: Product["category"][] = ["Tickets", "Jerseys", "Scarves", "Food Coupons", "Collectibles"];

export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => {
  const category = pick(CATS, random);
  const team = pick(TEAMS, random);

  return {
    id: `p-${i}`,
    title:
      category === "Jerseys"
        ? `${team} Home Jersey`
        : category === "Tickets"
          ? `VIP Ticket Sec ${Math.floor(random() * 120) + 100}`
          : category === "Scarves"
            ? `${team} Fan Scarf`
            : category === "Food Coupons"
              ? "Stadium Snack Bundle"
              : `Limited Edition ${team} Pin`,
    category,
    price: 10 + Math.floor(random() * 490),
    currency: "USD",
    condition: pick(["New", "Like New", "Used"] as const, random),
    rating: 3 + Math.round(random() * 20) / 10,
    seller: `${pick(FIRST_NAMES, random)} ${pick(LAST_NAMES, random)}`,
    sellerAvatar: `https://i.pravatar.cc/100?u=seller-${i}`,
    image: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
    images: [
      PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
      PRODUCT_IMAGES[(i + 1) % PRODUCT_IMAGES.length],
      PRODUCT_IMAGES[(i + 2) % PRODUCT_IMAGES.length],
    ],
    description:
      "Authentic stadium item from a verified seller. Pickup at Gate 3 or in-app delivery via FanMesh nearby relay.",
  };
});
