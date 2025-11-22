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

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl: string | null;
}

export interface CartData {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export type GetCartResponse = GetCartSuccess | GetCartError;
