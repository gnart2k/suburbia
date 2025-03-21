import { create } from "zustand";

type CheckoutProductType = {
  id: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
  productImage: string;
  productLink: string;
};

type CheckoutProductState = {
  products: {
    productLine: CheckoutProductType[];
    subtotal: string;
  };
  addProduct: (product: CheckoutProductType) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updatedProduct: Partial<CheckoutProductType>) => void;
  clearCart: () => void;
  setProducts: (products: {productItems: CheckoutProductType[], subtotal: string}) => void;
  updateSubtotal: () => void;
};

export const useCheckoutProductStore = create<CheckoutProductState>((set) => ({
  products: {
    productLine: [],
    subtotal: "0.00",
  },

  addProduct: (product) =>
    set((state) => {
      const updatedProductLine = [...state.products.productLine, product];
      return {
        products: {
          productLine: updatedProductLine,
          subtotal: calculateSubtotal(updatedProductLine),
        },
      };
    }),

  removeProduct: (id) =>
    set((state) => {
      const updatedProductLine = state.products.productLine.filter(
        (product) => product.id !== id
      );
      return {
        products: {
          productLine: updatedProductLine,
          subtotal: calculateSubtotal(updatedProductLine),
        },
      };
    }),

  updateProduct: (id, updatedProduct) =>
    set((state) => {
      const updatedProductLine = state.products.productLine.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      );
      return {
        products: {
          productLine: updatedProductLine,
          subtotal: calculateSubtotal(updatedProductLine),
        },
      };
    }),

  clearCart: () =>
    set({
      products: {
        productLine: [],
        subtotal: "0.00",
      },
    }),

  setProducts: (products) =>
    set({
      products: {
        productLine: products.productItems,
        subtotal: products.subtotal,
      },
    }),

  updateSubtotal: () =>
    set((state) => ({
      products: {
        ...state.products,
        subtotal: calculateSubtotal(state.products.productLine),
      },
    })),
}));

// Function to calculate subtotal
const calculateSubtotal = (productLine: CheckoutProductType[]): string => {
  const total = productLine.reduce(
    (sum, product) => sum + parseFloat(product.price.replace("$", "")) * product.quantity,
    0
  );
  return `$${total.toFixed(2)}`;
};
