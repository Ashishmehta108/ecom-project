"use server";

import { db } from "../db";

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

export async function filterProducts(params: FilterParams) {
  const { category, sort = "featured", search } = params;

  let products = await fetchProductsFromDB();

  const categoryMap = new Map<
    string,
    { id: string; name: string; count: number }
  >();

  products.forEach((product) => {
    product.productCategories.forEach((pc) => {
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

  if (category && category !== "all") {
    products = products.filter((product) =>
      product.productCategories.some((pc) => pc.categoryId === category)
    );
  }

  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    products = products.filter((product) => {
      const searchableText = [
        product.productName,
        product.brand,
        product.model,
        product.subCategory,
        product.description,
        ...product.features,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }

  // Sort products
  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.pricing.price - b.pricing.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.pricing.price - a.pricing.price);
      break;
    case "newest":
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "name-asc":
      products.sort((a, b) => a.productName.localeCompare(b.productName));
      break;
    case "featured":
    default:
      // Keep default order or implement custom featured logic
      // e.g., sort by popularity, inStock first, etc.
      products.sort((a, b) => {
        if (a.pricing.inStock && !b.pricing.inStock) return -1;
        if (!a.pricing.inStock && b.pricing.inStock) return 1;
        return 0;
      });
      break;
  }

  return {
    products,
    categories,
  };
}

// Additional helper action for adding to cart
export async function addToCart(productId: string, quantity: number = 1) {
  // Implement cart logic here
  // This would typically:
  // 1. Get or create cart session
  // 2. Add product to cart
  // 3. Update cart totals

  return { success: true, message: "Added to cart" };
}

// Helper action for wishlist
export async function toggleWishlist(productId: string) {
  // Implement wishlist logic
  return { success: true, inWishlist: true };
}
