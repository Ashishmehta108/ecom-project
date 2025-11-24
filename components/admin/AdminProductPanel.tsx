"use client";

import React, { useTransition, useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ProductFormFormValues,
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product-schema";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Upload,
  X,
  Package,
  GripVertical,
  ImageIcon,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/admin-actions/prods";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import clsx from "clsx";
import { Category } from "@/lib/types/product.types";
import { TSpecsTab } from "./specTab";

type ProductImage = {
  url: string;
  fileId?: string;
};

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
  productImages: ProductImage[];
  categories: string[];
  slug?: string;
};

type Props = {
  initialProduct?: Partial<Product>;
  categories?: Category[];
  isNew?: boolean;
};

const EmptyState: React.FC<{
  icon: React.ReactNode;
  message: string;
  description?: string;
}> = ({ icon, message, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border-2 border-dashed border-neutral-200 dark:border-neutral-800">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 shadow-sm">
      {icon}
    </div>
    <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      {message}
    </p>
    {description && (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
        {description}
      </p>
    )}
  </div>
);

export const SectionHeader: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => (
  <div className="space-y-1 mb-6">
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    )}
  </div>
);

const uploadToImageKit = async (
  file: File
): Promise<{ url: string; fileId: string } | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/imagekit/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error || `Upload failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.url || !data.fileId) {
      throw new Error("Invalid response from server");
    }

    return { url: data.url, fileId: data.fileId };
  } catch (error: any) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

const GeneralTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Basic Information"
        description="Core details about your product"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Premium Wireless Earbuds"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Brand <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., TechBar"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Model Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., TB-X100"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Sub Category
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., True Wireless"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Description</FormLabel>
            <FormControl>
              <Textarea
                rows={6}
                className="resize-none rounded-xl"
                placeholder="Provide a detailed description of your product, including key selling points and benefits..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const PricingTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Pricing & Stock"
        description="Set your product pricing and inventory levels"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="pricing.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Price (INR) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                    ₹
                  </span>
                  <Input
                    type="text"
                    min={0}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        field.onChange(Number(value));
                      }
                    }}
                    className="h-11 rounded-xl pl-8"
                    placeholder="0.00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Discount (%)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        field.onChange(Number(value));
                      }
                    }}
                    className="h-11 rounded-xl pr-8"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.stockQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Stock Quantity
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value?.toString() ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(Number(value));
                    }
                  }}
                  className="h-11 rounded-xl"
                  placeholder="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const ImagesTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: "productImages",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadProgress("Uploading to ImageKit...");

    try {
      const uploaded = await uploadToImageKit(file);
      if (uploaded) {
        setUploadProgress("Upload complete!");
        append({ url: uploaded.url, fileId: uploaded.fileId });

        // Clear success message after 2s
        setTimeout(() => setUploadProgress(""), 2000);
      }
    } catch (error: any) {
      setUploadError(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    move(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Product Images"
        description="Upload and manage product photos. Drag to reorder."
      />

      {/* Upload Area */}
      <div className="space-y-4">
        <label
          className={clsx(
            "group relative flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
            uploading
              ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20"
              : "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {uploadProgress}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-neutral-600 dark:text-neutral-400" />
              </div>
              <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                Upload Product Image
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                PNG, JPG up to 5MB • Powered by ImageKit
              </p>
            </>
          )}

          <input
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept="image/*"
            disabled={uploading}
          />
        </label>

        {uploadError && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
            <X className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              {uploadError}
            </p>
          </div>
        )}
      </div>

      {/* Images Grid */}
      {fields.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8 text-neutral-400" />}
          message="No images uploaded"
          description="Upload your first product image to get started"
        />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="product-images" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((fieldItem, idx) => (
                  <Draggable
                    key={fieldItem.id}
                    draggableId={fieldItem.id}
                    index={idx}
                  >
                    {(drag, snapshot) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        className={clsx(
                          "relative group rounded-2xl overflow-hidden border-2 transition-all duration-200",
                          snapshot.isDragging
                            ? "border-blue-500 shadow-2xl scale-105 rotate-2"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg"
                        )}
                      >
                        <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900">
                          <Image
                            src={(fieldItem as any).url}
                            fill
                            alt={`Product ${idx + 1}`}
                            className="object-cover"
                          />

                          {/* Drag Handle */}
                          <div
                            {...drag.dragHandleProps}
                            className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-4 h-4 text-white" />
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            onClick={() => remove(idx)}
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>

                          {/* Image Number Badge */}
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <span className="text-xs font-medium text-white">
                              #{idx + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

const FeaturesTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Product Features"
        description="List key features and selling points"
      />

      {fields.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-neutral-400" />}
          message="No features added"
          description="Add key product features to highlight benefits"
        />
      ) : (
        <div className="space-y-3">
          {fields.map((fieldItem, idx) => (
            <FormField
              key={fieldItem.id}
              control={form.control}
              name={`features.${idx}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-8 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400 shrink-0">
                      {idx + 1}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g., Active noise cancellation"
                        className="h-11 rounded-xl flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(idx)}
                      className="h-11 w-11 shrink-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 gap-2 rounded-xl border-2 border-dashed hover:border-solid hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        onClick={() => append("")}
      >
        <Plus className="w-5 h-5" />
        Add Feature
      </Button>
    </div>
  );
};

const TagsTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Product Tags"
        description="Add tags to improve search and categorization"
      />

      {fields.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-neutral-400" />}
          message="No tags added"
          description="Add tags to make your product easier to find"
        />
      ) : (
        <div className="space-y-3">
          {fields.map((fieldItem, idx) => (
            <FormField
              key={fieldItem.id}
              control={form.control}
              name={`tags.${idx}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-8 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400 shrink-0">
                      #{idx + 1}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g., wireless, bluetooth"
                        className="h-11 rounded-xl flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(idx)}
                      className="h-11 w-11 shrink-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 gap-2 rounded-xl border-2 border-dashed hover:border-solid hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        onClick={() => append("")}
      >
        <Plus className="w-5 h-5" />
        Add Tag
      </Button>
    </div>
  );
};

const CategoriesTab: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  console.log(categories)
  const form = useFormContext<ProductFormValues>();
  const selected: string[] = form.watch("categories") ?? [];

  const toggleCategory = (categoryName: string) => {
    if (selected.includes(categoryName)) {
      form.setValue(
        "categories",
        selected.filter((c) => c !== categoryName),
        { shouldDirty: true }
      );
    } else {
      form.setValue("categories", [...selected, categoryName], {
        shouldDirty: true,
      });
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-8 h-8 text-neutral-400" />}
        message="No categories available"
        description="Create categories first to organize your products"
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Product Categories"
        description="Select categories this product belongs to"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          console.log(categories)
          const isSelected = selected.includes(category.name);

          return (
            <label
              key={category.id}
              className={clsx(
                "relative flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 group",
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              )}
            >
              <div className="flex items-center h-6 shrink-0">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                  checked={isSelected}
                  onChange={() => toggleCategory(category.category.name)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.category.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  ID: {category.category.id}
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default function AdminProductPanel({
  initialProduct = {},
  categories = [],
  isNew = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const normalizeSpecs = (specObj?: Record<string, unknown>) =>
    Object.entries(specObj ?? {}).map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
    }));
    console.log(normalizeSpecs)
  const [lastUpdated, setLastUpdated] = useState("");
  React.useEffect(() => setLastUpdated(new Date().toLocaleDateString()), []);
  console.log(categories, initialProduct);
  const defaultValues: ProductFormValues = {
    id: initialProduct.id ?? undefined,

    productName: initialProduct.productName ?? "",
    brand: initialProduct.brand ?? "",
    model: initialProduct.model ?? "",
    subCategory: initialProduct.subCategory ?? "",
    description: initialProduct.description ?? "",

    features: initialProduct.features ?? [],
    tags: initialProduct.tags ?? [],
    categories:
    //@ts-ignore
      initialProduct.productCategories,
    pricing: initialProduct.pricing ?? {
      price: 0,
      currency: "INR",
      discount: 0,
      inStock: true,
      stockQuantity: 0,
    },

    specifications:normalizeSpecs,

    productImages: (initialProduct.productImages ?? []).map((img) => ({
      url: img.url,
      fileId: img.fileId,
    })),
  };

  console.log(defaultValues.categories);
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ProductFormValues> = (values) => {
    startTransition(() => {
      (async () => {
        try {
          const payload = { ...values };
          console.log(isNew);
          if (isNew) {
            const saved = await createProductAction(payload);
            alert("✅ Product created successfully!");
            if (saved?.id) {
              window.location.href = `/admin/products/${saved.id}`;
            }
          } else if (values.id) {
            await updateProductAction(values.id, payload);
            alert("✅ Product updated successfully!");
          }
        } catch (error: any) {
          console.error("Product save error:", error);
          alert(`❌ ${error?.message ?? "Failed to save product"}`);
        }
      })();
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Link href="/admin/products">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 rounded-xl border-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {isNew ? "Create Product" : "Edit Product"}
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400">
                {isNew
                  ? "Add a new product to your catalog"
                  : "Update product information and settings"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
          <CardHeader className="border-b-2 border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Product Configuration
                </CardTitle>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage all aspects of your product listing
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <FormProvider {...form}>
              <Form {...form}>
                <form
                  id="product-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        {isNew ? "Create Product" : "Save Changes"}
                      </>
                    )}
                  </Button>
                  <Tabs defaultValue="general" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                      <TabsTrigger
                        value="general"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        General
                      </TabsTrigger>
                      <TabsTrigger
                        value="pricing"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Pricing
                      </TabsTrigger>
                      <TabsTrigger
                        value="specs"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Specs
                      </TabsTrigger>
                      <TabsTrigger
                        value="images"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Images
                      </TabsTrigger>
                      <TabsTrigger
                        value="features"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Features
                      </TabsTrigger>
                      <TabsTrigger
                        value="categories"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Categories
                      </TabsTrigger>
                      <TabsTrigger
                        value="tags"
                        className="h-11 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all"
                      >
                        Tags
                      </TabsTrigger>
                    </TabsList>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 min-h-[400px]">
                      <TabsContent value="general" className="mt-0">
                        <GeneralTab />
                      </TabsContent>

                      <TabsContent value="pricing" className="mt-0">
                        <PricingTab />
                      </TabsContent>

                      <TabsContent value="specs" className="mt-0">
                        {/* <SpecsTab />
                         */}
                        <TSpecsTab />
                      </TabsContent>

                      <TabsContent value="images" className="mt-0">
                        <ImagesTab />
                      </TabsContent>

                      <TabsContent value="features" className="mt-0">
                        <FeaturesTab />
                      </TabsContent>

                      <TabsContent value="categories" className="mt-0">
                        <CategoriesTab categories={defaultValues.categories} />
                      </TabsContent>

                      <TabsContent value="tags" className="mt-0">
                        <TagsTab />
                      </TabsContent>
                    </div>
                  </Tabs>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p>Auto-saved to database on submit</p>
          </div>
          <p>Last updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}
