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
