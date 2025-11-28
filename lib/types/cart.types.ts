export type Cart = {
  id: string;
  name: string;
  price: number;
  products: ProductInCart[];
};

export type ProductInCart = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};
// lib/types/cart.types.ts


// lib/types/cart.types.ts
export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl?: string | null;
  stockQuantity?: number;
  inStock?: boolean;
};

export type CartData = {
  id: string;
  userId: string;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GetCartResponse = {
  success: boolean;
  data: {
    cart: CartData;
    items: CartItem[];
    removedOutOfStock?: number;
  } | null;
  error: string | null;
};

export interface GetCartSuccess {
  success: true;
  data: {
    cart: CartData;
    items: CartItem[];
  };
  error: null;
}

export interface GetCartError {
  success: false;
  data: null;
  error: string;
}


