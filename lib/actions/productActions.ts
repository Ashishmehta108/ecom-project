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

  // Create pairs of original and resolved products for filtering and sorting
  // We keep the original multilingual objects but use resolved versions for operations
  let productsWithResolved = products.map((product) => ({
    original: product,
    resolved: resolveProductForLanguage(product, lang),
  }));

  // Filter by search FIRST (before counting categories)
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

  // Count categories from filtered products (after search, before category filter)
  // This way category counts reflect products that match the search
  const categoryMap = new Map<
    string,
    { id: string; name: string | { en: string; pt: string }; count: number }
  >();

  productsWithResolved.forEach((item) => {
    (item.original as any).productCategories?.forEach((pc: any) => {
      const cat = pc.category;
      if (categoryMap.has(cat.id)) {
        categoryMap.get(cat.id)!.count++;
      } else {
        categoryMap.set(cat.id, { id: cat.id, name: cat.name, count: 1 });
      }
    });
  });

  const categories = Array.from(categoryMap.values()).sort((a, b) => {
    const nameA = typeof a.name === 'string' ? a.name : ((a.name as { en: string; pt: string })[lang] || (a.name as { en: string; pt: string }).en || '');
    const nameB = typeof b.name === 'string' ? b.name : ((b.name as { en: string; pt: string })[lang] || (b.name as { en: string; pt: string }).en || '');
    return nameA.localeCompare(nameB);
  });

  // Filter by category AFTER counting (so counts reflect search results)
  if (category && category !== "all") {
    productsWithResolved = productsWithResolved.filter((item) =>
      (item.original as any).productCategories?.some((pc: any) => pc.categoryId === category)
    );
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

