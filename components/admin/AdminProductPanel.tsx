"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { X, Plus, Upload, Loader2, Package } from "lucide-react";
import clsx from "clsx";

type Product = {
  id: string;
  productName: string;
  brand: string;
  model: string;
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
  specifications?: {
    general?: Record<string, any>;
    technical?: Record<string, any>;
  };
  tags: string[];
  variants?: Variant[];
  productImages: ProductImage[];
  productCategories: ProductCategory[];
  slug: string;
};

type ProductImage = {
  id?: string;
  url: string;
  fileId?: string;
  position?: number;
};

type Variant = {
  title: string;
  price: number;
  stock: number;
};

type ProductCategory = {
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  initialProduct: Partial<Product>;
  categories?: Category[];
  isNew?: boolean;
};

// ============================================================================
// SUB-COMPONENTS - Extracted for cleaner code structure
// ============================================================================

/**
 * Reusable feature/tag item with remove button
 */
const EditableListItem: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, onRemove, placeholder, disabled }) => (
  <div className="flex gap-2 items-center">
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="flex-1"
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={onRemove}
      disabled={disabled}
      className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
    >
      <X className="w-4 h-4" />
    </Button>
  </div>
);

/**
 * Image upload card with loading state
 */
const ImageCard: React.FC<{
  image: ProductImage;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ image, onRemove, disabled }) => (
  <div className="relative group rounded-xl overflow-hidden border border-muted/20 bg-muted/5 hover:border-muted/40 transition-all">
    <div className="aspect-[4/3] relative">
      <Image
        src={image.url}
        fill
        alt="Product image"
        className="object-cover"
      />
    </div>
    <button
      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
      onClick={onRemove}
      disabled={disabled}
    >
      <X className="w-4 h-4 text-white" />
    </button>
  </div>
);

/**
 * Loading skeleton for image upload
 */
const ImageLoadingSkeleton: React.FC = () => (
  <div className="relative rounded-xl overflow-hidden border border-muted/20 bg-muted/5">
    <div className="aspect-[4/3] relative flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  </div>
);

/**
 * Variant editor row
 */
const VariantRow: React.FC<{
  variant: Variant;
  onUpdate: (patch: Partial<Variant>) => void;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ variant, onUpdate, onRemove, disabled }) => (
  <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-3 items-center p-4 border border-muted/20 rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors">
    <Input
      value={variant.title ?? ""}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Variant name (e.g., Blue, Large)"
      disabled={disabled}
    />
    <Input
      type="number"
      value={variant.price?.toString() ?? ""}
      onChange={(e) => onUpdate({ price: Number(e.target.value) })}
      placeholder="Price"
      disabled={disabled}
    />
    <Input
      type="number"
      value={variant.stock?.toString() ?? ""}
      onChange={(e) => onUpdate({ stock: Number(e.target.value) })}
      placeholder="Stock"
      disabled={disabled}
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={onRemove}
      disabled={disabled}
      className="hover:bg-destructive/10 hover:text-destructive transition-colors"
    >
      <X className="w-4 h-4" />
    </Button>
  </div>
);

/**
 * Empty state component
 */
const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({
  icon,
  message,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminProductPanel({
  initialProduct,
  categories = [],
  isNew = false,
}: Props) {
  // ==================== STATE ====================

  // Main product state with safe defaults
  const [product, setProduct] = useState<Partial<Product>>({
    id: initialProduct.id ?? "",
    productName: initialProduct.productName ?? "",
    brand: initialProduct.brand ?? "",
    model: initialProduct.model ?? "",
    subCategory: initialProduct.subCategory ?? "",
    description: initialProduct.description ?? "",
    features: initialProduct.features ?? [],
    pricing: initialProduct.pricing ?? {
      price: 0,
      currency: "INR",
      discount: 0,
      inStock: true,
      stockQuantity: 0,
    },
    specifications: initialProduct.specifications ?? {
      general: {},
      technical: {},
    },
    tags: initialProduct.tags ?? [],
    variants: initialProduct.variants ?? [],
    productImages: initialProduct.productImages ?? [],
    productCategories: initialProduct.productCategories ?? [],
    slug: initialProduct.slug ?? "", // Fixed: was using tags instead of slug
  });

  // Selected category IDs for multi-select
  const initialSelected = (initialProduct.productCategories ?? []).map(
    (pc) => pc.categoryId
  );
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<string[]>(initialSelected);

  // Loading states
  const [isPending, startTransition] = useTransition();
  const [uploadingImage, setUploadingImage] = useState(false);

  // ==================== HELPERS ====================

  /**
   * Type-safe field updater for top-level fields
   */
  const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Type-safe nested updater with proper error handling
   * Supports dot notation like "pricing.price" or "specifications.general.color"
   */
  const updateNested = (path: string, value: any) => {
    setProduct((prev) => {
      const clone = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid mutations
      const keys = path.split(".");
      let ref = clone;

      // Navigate to parent object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!ref[key] || typeof ref[key] !== "object") {
          ref[key] = {};
        }
        ref = ref[key];
      }

      // Set the final value
      ref[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  // ==================== FEATURES ====================

  const addFeature = () => {
    setProduct((prev) => ({
      ...prev,
      features: [...(prev.features ?? []), ""],
    }));
  };

  const removeFeature = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: (prev.features ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setProduct((prev) => {
      const updated = [...(prev.features ?? [])];
      updated[index] = value;
      return { ...prev, features: updated };
    });
  };

  // ==================== TAGS ====================

  const addTag = () => {
    setProduct((prev) => ({
      ...prev,
      tags: [...(prev.tags ?? []), ""],
    }));
  };

  const removeTag = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      tags: (prev.tags ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateTag = (index: number, value: string) => {
    setProduct((prev) => {
      const updated = [...(prev.tags ?? [])];
      updated[index] = value;
      return { ...prev, tags: updated };
    });
  };

  // ==================== IMAGES ====================

  const addImage = (img: ProductImage) => {
    setProduct((prev) => ({
      ...prev,
      productImages: [...(prev.productImages ?? []), img],
    }));
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      productImages: (prev.productImages ?? []).filter((_, i) => i !== index),
    }));
  };

  /**
   * ImageKit upload with loading state
   */
  const uploadToImageKit = async (
    file: File
  ): Promise<{ url: string; fileId: string } | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

      const response = await fetch(`${baseUrl}/api/imagekit/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      return { url: data.url, fileId: data.fileId };
    } catch (error: any) {
      console.error("Image upload error:", error);
      alert(error.message ?? "Upload failed");
      return null;
    }
  };

  /**
   * Handle file input change with loading state
   */
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploaded = await uploadToImageKit(file);
      if (uploaded) {
        addImage({ url: uploaded.url, fileId: uploaded.fileId });
      }
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // Reset input
    }
  };

  // ==================== VARIANTS ====================

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants ?? []), { title: "", price: 0, stock: 0 }],
    }));
  };

  const updateVariant = (index: number, patch: Partial<Variant>) => {
    setProduct((prev) => {
      const updated = [...(prev.variants ?? [])];
      updated[index] = { ...updated[index], ...patch };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
  };

  // ==================== CATEGORIES ====================

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ==================== SLUG ====================

  /**
   * Generate SEO-friendly slug from product name
   */
  const generateSlug = () => {
    const name = product.productName ?? "";
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setField("slug", slug);
  };

  // ==================== SAVE ====================

  /**
   * Save product with proper loading state
   */
  const handleSave = async () => {
    startTransition(async () => {
      try {
        // Build payload
        const payload: any = { ...product };

        // Map category IDs to proper format
        payload.productCategories = selectedCategoryIds.map((id) => ({
          categoryId: id,
        }));

        // Clean up image data
        payload.productImages = (product.productImages ?? []).map(
          (img, idx) => ({
            id: img.id,
            url: img.url,
            fileId: img.fileId,
            position: img.position ?? idx,
          })
        );

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        const url = isNew
          ? `${baseUrl}/api/admin/products`
          : `${baseUrl}/api/admin/products/${product.id}`;

        const response = await fetch(url, {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to save product");
        }

        const saved = await response.json();
        alert("Product saved successfully!");

        // Redirect to edit page if creating new product
        if (isNew && saved?.id) {
          window.location.href = `/admin/products/${saved.id}`;
        }
      } catch (error: any) {
        console.error("Save error:", error);
        alert(error.message ?? "Failed to save product");
      }
    });
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "Create Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage product details, pricing, images, and variants
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={generateSlug}
              variant="outline"
              disabled={isPending || !product.productName}
              className="gap-2"
            >
              Generate Slug
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="gap-2 min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="rounded-2xl border-muted/20 shadow-sm">
          <CardHeader className="border-b border-muted/20">
            <CardTitle className="text-xl">Product Configuration</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="general" className="space-y-6">
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1 bg-muted/50">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-background"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="data-[state=active]:bg-background"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="specs"
                  className="data-[state=active]:bg-background"
                >
                  Specs
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-background"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-background"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="variants"
                  className="data-[state=active]:bg-background"
                >
                  Variants
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-background"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger
                  value="tags"
                  className="data-[state=active]:bg-background"
                >
                  Tags
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Product Name *
                    </label>
                    <Input
                      value={product.productName ?? ""}
                      onChange={(e) => setField("productName", e.target.value)}
                      placeholder="Enter product name"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Input
                      value={product.brand ?? ""}
                      onChange={(e) => setField("brand", e.target.value)}
                      placeholder="Enter brand name"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input
                      value={product.model ?? ""}
                      onChange={(e) => setField("model", e.target.value)}
                      placeholder="Enter model number"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sub Category</label>
                    <Input
                      value={product.subCategory ?? ""}
                      onChange={(e) => setField("subCategory", e.target.value)}
                      placeholder="Enter sub category"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input
                      value={product.slug ?? ""}
                      onChange={(e) => setField("slug", e.target.value)}
                      placeholder="product-url-slug"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={product.description ?? ""}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Enter detailed product description"
                    rows={6}
                    disabled={isPending}
                    className="resize-none"
                  />
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (INR) *</label>
                    <Input
                      type="number"
                      value={product.pricing?.price?.toString() ?? "0"}
                      onChange={(e) =>
                        updateNested("pricing.price", Number(e.target.value))
                      }
                      placeholder="0.00"
                      disabled={isPending}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount (%)</label>
                    <Input
                      type="number"
                      value={product.pricing?.discount?.toString() ?? "0"}
                      onChange={(e) =>
                        updateNested("pricing.discount", Number(e.target.value))
                      }
                      placeholder="0"
                      disabled={isPending}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      value={product.pricing?.stockQuantity?.toString() ?? "0"}
                      onChange={(e) =>
                        updateNested(
                          "pricing.stockQuantity",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      disabled={isPending}
                      min="0"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    General Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications?.general ?? {}).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <Input
                            value={
                              Array.isArray(value)
                                ? value.join(", ")
                                : String(value)
                            }
                            onChange={(e) =>
                              updateNested(
                                `specifications.general.${key}`,
                                e.target.value
                              )
                            }
                            disabled={isPending}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      product.specifications?.technical ?? {}
                    ).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        <Input
                          value={String(value)}
                          onChange={(e) =>
                            updateNested(
                              `specifications.technical.${key}`,
                              e.target.value
                            )
                          }
                          disabled={isPending}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                {(product.productImages?.length ?? 0) === 0 &&
                !uploadingImage ? (
                  <EmptyState
                    icon={<Package className="w-6 h-6 text-muted-foreground" />}
                    message="No images added yet. Upload your first product image."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.productImages?.map((img, idx) => (
                      <ImageCard
                        key={idx}
                        image={img}
                        onRemove={() => removeImage(idx)}
                        disabled={isPending}
                      />
                    ))}

                    {/* Show loading skeleton during upload */}
                    {uploadingImage && <ImageLoadingSkeleton />}
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-muted/40 rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/10 hover:border-muted/60 transition-all">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept="image/*"
                    disabled={isPending || uploadingImage}
                  />
                </label>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4">
                {(product.features?.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={<Plus className="w-6 h-6 text-muted-foreground" />}
                    message="No features added yet. Add key product features."
                  />
                ) : (
                  <div className="space-y-3">
                    {product.features?.map((feature, idx) => (
                      <EditableListItem
                        key={idx}
                        value={feature}
                        onChange={(value) => updateFeature(idx, value)}
                        onRemove={() => removeFeature(idx)}
                        placeholder="Enter product feature"
                        disabled={isPending}
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={addFeature}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isPending}
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </Button>
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants" className="space-y-4">
                {(product.variants?.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={<Package className="w-6 h-6 text-muted-foreground" />}
                    message="No variants added yet. Add product variants like size or color."
                  />
                ) : (
                  <div className="space-y-3">
                    {product.variants?.map((variant, idx) => (
                      <VariantRow
                        key={idx}
                        variant={variant}
                        onUpdate={(patch) => updateVariant(idx, patch)}
                        onRemove={() => removeVariant(idx)}
                        disabled={isPending}
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={addVariant}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isPending}
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </Button>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4">
                {categories.length === 0 ? (
                  <EmptyState
                    icon={<Package className="w-6 h-6 text-muted-foreground" />}
                    message="No categories available. Create categories first."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const isSelected = selectedCategoryIds.includes(
                        category.id
                      );
                      return (
                        <label
                          key={category.id}
                          className={clsx(
                            "flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all",
                            "hover:border-primary/50 hover:bg-muted/20",
                            isSelected && "border-primary bg-primary/5",
                            isPending && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCategory(category.id)}
                            disabled={isPending}
                            className="w-4 h-4"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {category.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {category.id}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Tags Tab */}
              <TabsContent value="tags" className="space-y-4">
                {(product.tags?.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={<Plus className="w-6 h-6 text-muted-foreground" />}
                    message="No tags added yet. Add tags to improve searchability."
                  />
                ) : (
                  <div className="space-y-3">
                    {product.tags?.map((tag, idx) => (
                      <EditableListItem
                        key={idx}
                        value={tag}
                        onChange={(value) => updateTag(idx, value)}
                        onRemove={() => removeTag(idx)}
                        placeholder="Enter tag"
                        disabled={isPending}
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={addTag}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isPending}
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <p>All changes are saved to the database</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
