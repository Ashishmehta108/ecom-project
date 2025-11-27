export type OrderAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderProduct = {
  id: string;
  name: string;
  description?: string | null;
  image: string | null;
  price: number;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: OrderProduct;
};

export type Order = {
  id: string;
  userId: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  orderStatus: string;

  shippingAddressId: string | null;
  shippingAddress: OrderAddress | null;

  items: OrderItem[];
};
