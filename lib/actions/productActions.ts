"use server";

import { db } from "../db";
import { resolveProductForLanguage } from "@/lib/utils/language";
import type { Language } from "@/lib/types/product.types";

// This would typically fetch from your database
// For now, simulating with a function that returns your product data

type ProductData = {
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
  specifications: {
    general: Record<string, any>;
    technical: Record<string, any>;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  productCategories: Array<{
    productId: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }>;
  productImages: Array<{
    id: string;
    productId: string;
    url: string;
    fileId: string;
    position: string;
  }>;
};

type FilterParams = {
  category?: string;
  sort?: string;
  search?: string;
};

async function fetchProductsFromDB() {
  const data = await db.query.product.findMany({
    with: {
      productCategories: {
        with: {
          category: true,
        },
      },
      productImages: true,
    },
  });
  return data;
}

export async function filterProducts(
  params: FilterParams & { lang?: Language }
) {
  const { category, sort = "featured", search, lang = "en" } = params;

  let products = await fetchProductsFromDB();

  const categoryMap = new Map<
    string,
    { id: string; name: string; count: number }
  >();

  products.forEach((product: any) => {
    product.productCategories?.forEach((pc: any) => {
      const cat = pc.category;
      if (categoryMap.has(cat.id)) {
        categoryMap.get(cat.id)!.count++;
      } else {
        categoryMap.set(cat.id, { id: cat.id, name: cat.name, count: 1 });
      }
    });
  });

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Create pairs of original and resolved products for filtering and sorting
  // We keep the original multilingual objects but use resolved versions for operations
  let productsWithResolved = products.map((product) => ({
    original: product,
    resolved: resolveProductForLanguage(product, lang),
  }));

  // Filter by category
  if (category && category !== "all") {
    productsWithResolved = productsWithResolved.filter((item) =>
      (item.original as any).productCategories?.some((pc: any) => pc.categoryId === category)
    );
  }

  // Filter by search
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    productsWithResolved = productsWithResolved.filter((item) => {
      const searchableText = [
        item.resolved.productName,
        item.resolved.brand,
        item.resolved.model,
        item.resolved.subCategory,
        item.resolved.description,
        ...item.resolved.features,
        ...item.resolved.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }

  // Sort products using resolved versions
  switch (sort) {
    case "price-asc":
      productsWithResolved.sort((a, b) => a.resolved.pricing.price - b.resolved.pricing.price);
      break;
    case "price-desc":
      productsWithResolved.sort((a, b) => b.resolved.pricing.price - a.resolved.pricing.price);
      break;
    case "newest":
      productsWithResolved.sort(
        (a, b) =>
          new Date(b.resolved.createdAt).getTime() - new Date(a.resolved.createdAt).getTime()
      );
      break;
    case "name-asc":
      productsWithResolved.sort((a, b) => a.resolved.productName.localeCompare(b.resolved.productName));
      break;
    case "featured":
    default:
      productsWithResolved.sort((a, b) => {
        if (a.resolved.pricing.inStock && !b.resolved.pricing.inStock) return -1;
        if (!a.resolved.pricing.inStock && b.resolved.pricing.inStock) return 1;
        return 0;
      });
      break;
  }

  // Return original products with multilingual objects (not resolved)
  products = productsWithResolved.map((item) => item.original);

  return {
    products,
    categories,
  };
}

