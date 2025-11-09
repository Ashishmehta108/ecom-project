type Favourite = {
  id: string;
  userId: string;
  products: PorductInFavourite[];
};

type PorductInFavourite = {
  productId: string;
  name: string;
  price: number;
};
