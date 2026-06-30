import type { Product } from "@/types";
import { PRODUCTS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

let products = cloneMock(PRODUCTS);

export const MarketplaceService = {
  async getProducts(): Promise<Product[]> {
    return withMockLatency(() => cloneMock(products));
  },

  async getProductById(id: string): Promise<Product | null> {
    return withMockLatency(() => cloneMock(products.find((product) => product.id === id) ?? null));
  },

  async searchProducts(query: string): Promise<Product[]> {
    return withMockLatency(() =>
      cloneMock(
        products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase())),
      ),
    );
  },
};
