export type Product = {
  id: string;
  productName: string;
  brand: string;
  model: string;
  categories: string[];
  subCategory: string;
  description: string;
  features: string[];

  pricing: {
    price: number;
    currency: string;
    discount: number;
    inStock: boolean;
    stockQuantity: number;
  };


  specifications: {
    general: Record<string, any>;
    technical: Record<string, any>;
  };

  productImages: {
    url: string;
    fileId?: string;
  }[];

  tags: string[];
};

export type productPageProductType = {
  id: string;
  productName: string;
  brand: string;
  model: string;
  subCategory: string;
  description: string;
  features: string[];
  pricing: {
    price: number;
    inStock: boolean;
    currency: string;
    discount: number;
  };
  productCategories: Array<{
    category: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }>;
  productImages: Array<{
    url: string;
    position: string;
  }>;
  tags: string[];
};

// types/product.ts
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  fileId?: string | null;
  position?: number | null;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Variant {
  id?: string;
  title: string;
  price?: number;
  stock?: number;
  sku?: string;
  [k: string]: any;
}

export interface Pricing {
  price: number;
  currency: string;
  discount: number;
  inStock: boolean;
  stockQuantity?: number;
}

export interface Specifications {
  general: Record<string, string | string[]>;
  technical: Record<string, string>;
}
