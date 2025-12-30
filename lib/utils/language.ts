import type { Language, TranslatedField, TranslatedArray } from "@/lib/types/product.types";

export function getLanguageFromRequest(
  headers: Headers,
  searchParams?: URLSearchParams
): Language {
  // Check query param first
  const langParam = searchParams?.get("lang");
  if (langParam === "en" || langParam === "pt") {
    return langParam;
  }

  // Check Accept-Language header
  const acceptLanguage = headers.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.includes("pt")) return "pt";
    if (acceptLanguage.includes("en")) return "en";
  }

  // Default to English
  return "en";
}

export function getTranslatedText(
  field: TranslatedField | null | undefined,
  lang: Language
): string {
  if (!field) return "";
  return field[lang] || field.en || "";
}

export function getTranslatedArray(
  field: TranslatedArray | null | undefined,
  lang: Language
): string[] {
  if (!field) return [];
  return field[lang] || field.en || [];
}

export function resolveProductForLanguage<T extends { productName?: any; description?: any; features?: any; tags?: any; subCategory?: any }>(
  product: T,
  lang: Language
): T & {
  productName: string;
  description: string;
  features: string[];
  tags: string[];
  subCategory: string;
} {
  return {
    ...product,
    productName: getTranslatedText(product.productName, lang),
    description: getTranslatedText(product.description, lang),
    features: getTranslatedArray(product.features, lang),
    tags: getTranslatedArray(product.tags, lang),
    subCategory: getTranslatedText(product.subCategory, lang),
  };
}

// Helper to resolve specification values (can be string, array, or multilingual object)
export function resolveSpecValue(
  value: any,
  lang: Language
): string | string[] {
  // If it's already a multilingual object
  if (value && typeof value === "object" && !Array.isArray(value) && ("en" in value || "pt" in value)) {
    return value[lang] || value.en || "";
  }
  
  // If it's an array of multilingual objects
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && ("en" in value[0] || "pt" in value[0])) {
    return value.map((item: any) => item[lang] || item.en || "");
  }
  
  // Otherwise return as-is (string or array)
  return value;
}
