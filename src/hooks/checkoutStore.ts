import { create } from "zustand";


type CheckoutProduct = {
  products: CheckoutProductType[];
  addProduct: (product: CheckoutProductType) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updatedProduct: Partial<CheckoutProductType>) => void;
  clearCart: () => void;
};

export const useCheckoutProductStore = create<CheckoutProduct>((set) => ({
  products: [],

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),

  clearCart: () => set({ products: [] }),
}));
