import { create } from "zustand";
import { Product, CartItem } from "@/types";
import { PRODUCTS } from "@/lib/mock-data";

type ProductCategory = "Tickets" | "Jerseys" | "Scarves" | "Food Coupons" | "Collectibles" | "All";

interface MarketplaceStore {
  products: Product[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  wishlist: Set<string>;
  cart: CartItem[];

  searchProducts: (query: string) => void;
  filterCategory: (category: ProductCategory) => void;
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getFilteredProducts: () => Product[];
}

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  products: PRODUCTS,
  selectedCategory: "All",
  searchQuery: "",
  wishlist: new Set<string>(),
  cart: [],

  searchProducts: (query) => set({ searchQuery: query }),

  filterCategory: (category) => set({ selectedCategory: category }),

  toggleWishlist: (productId) =>
    set((state) => {
      const newWishlist = new Set(state.wishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return { wishlist: newWishlist };
    }),

  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.productId === productId);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        cart: [...state.cart, { productId, quantity }],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    })),

  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  getFilteredProducts: () => {
    const state = get();
    return state.products.filter((product) => {
      const matchesCategory =
        state.selectedCategory === "All" ||
        product.category === state.selectedCategory;
      const matchesSearch =
        !state.searchQuery ||
        product.title.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
}));

// Selectors
export const selectProducts = (state: MarketplaceStore) => state.products;
export const selectSelectedCategory = (state: MarketplaceStore) =>
  state.selectedCategory;
export const selectSearchQuery = (state: MarketplaceStore) =>
  state.searchQuery;
export const selectWishlist = (state: MarketplaceStore) => state.wishlist;
export const selectCart = (state: MarketplaceStore) => state.cart;
export const selectCartTotal = (state: MarketplaceStore) => {
  return state.cart.reduce((total, item) => {
    const product = state.products.find((p) => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
};
export const selectIsInWishlist = (productId: string) => (state: MarketplaceStore) =>
  state.wishlist.has(productId);
export const selectProductById = (productId: string) => (state: MarketplaceStore) =>
  state.products.find((p) => p.id === productId);
