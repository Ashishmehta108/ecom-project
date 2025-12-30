export type Language = "en" | "pt";
export type TranslatedField = { en: string; pt: string };
export type TranslatedArray = { en: string[]; pt: string[] };

export type Product = {
  id: string;
  productName: TranslatedField;
  brand: string;
  model: string;
  categories: string[];
  subCategory: TranslatedField; // Updated to TranslatedField
  description: TranslatedField;
  features: TranslatedArray;
  pricing: {
    price: number;
    currency: string;
    discount: number;
    inStock: boolean;
    stockQuantity: number;
  };
  specifications: {
    general?: Record<string, any>; // Can be string, array, or { en: string; pt: string }
    technical?: Record<string, any>; // Can be string, array, or { en: string; pt: string }
    [key: string]: any;
  };
  productImages: {
    url: string;
    fileId?: string;
  }[];
  tags: TranslatedArray;
};

export type productPageProductType = {
  id: string;
  productName: string; // This will be the resolved string based on language
  brand: string;
  model: string;
  subCategory: string;
  description: string; // Resolved
  features: string[]; // Resolved
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
  tags: string[]; // Resolved
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
