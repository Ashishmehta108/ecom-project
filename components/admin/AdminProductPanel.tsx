// "use client";

// import React, { useState, useTransition } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import Image from "next/image";
// import { X, Plus, Upload, Loader2, Package, ArrowLeft } from "lucide-react";
// import clsx from "clsx";
// import { nanoid } from "nanoid";
// import Link from "next/link";

// // ============================================================================
// // TYPES
// // ============================================================================

// type Product = {
//   id: string;
//   productName: string;
//   brand: string;
//   model: string;
//   subCategory: string;
//   description: string;
//   features: string[];
//   pricing: {
//     price: number;
//     currency: string;
//     discount: number;
//     inStock: boolean;
//     stockQuantity: number;
//   };
//   specifications?: {
//     general?: Record<string, any>;
//     technical?: Record<string, any>;
//   };
//   tags: string[];
//   variants?: Variant[];
//   productImages: ProductImage[];
//   productCategories: ProductCategory[];
//   slug: string;
// };

// type ProductImage = {
//   id?: string;
//   url: string;
//   fileId?: string;
//   position?: number;
// };

// type Variant = {
//   title: string;
//   price: number;
//   stock: number;
// };

// type ProductCategory = {
//   categoryId: string;
// };

// type Category = {
//   id: string;
//   name: string;
// };

// type Props = {
//   initialProduct: Partial<Product>;
//   categories?: Category[];
//   isNew?: boolean;
// };

// // ============================================================================
// // SUB-COMPONENTS - Extracted for cleaner code structure
// // ============================================================================

// /**
//  * Reusable feature/tag item with remove button
//  */
// const EditableListItem: React.FC<{
//   value: string;
//   onChange: (value: string) => void;
//   onRemove: () => void;
//   placeholder?: string;
//   disabled?: boolean;
// }> = ({ value, onChange, onRemove, placeholder, disabled }) => (
//   <div className="flex gap-2 items-center">
//     <Input
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       disabled={disabled}
//       className="flex-1"
//     />
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={onRemove}
//       disabled={disabled}
//       className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
//     >
//       <X className="w-4 h-4" />
//     </Button>
//   </div>
// );

// /**
//  * Image upload card with loading state
//  */
// const ImageCard: React.FC<{
//   image: ProductImage;
//   onRemove: () => void;
//   disabled?: boolean;
// }> = ({ image, onRemove, disabled }) => (
//   <div className="relative group rounded-xl overflow-hidden border border-muted/20 bg-muted/5 hover:border-muted/40 transition-all">
//     <div className="aspect-[4/3] relative">
//       <Image
//         src={image.url}
//         fill
//         alt="Product image"
//         className="object-cover"
//       />
//     </div>
//     <button
//       className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
//       onClick={onRemove}
//       disabled={disabled}
//     >
//       <X className="w-4 h-4 text-white" />
//     </button>
//   </div>
// );

// /**
//  * Loading skeleton for image upload
//  */
// const ImageLoadingSkeleton: React.FC = () => (
//   <div className="relative rounded-xl overflow-hidden border border-muted/20 bg-muted/5">
//     <div className="aspect-[4/3] relative flex items-center justify-center">
//       <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//     </div>
//   </div>
// );

// /**
//  * Variant editor row
//  */
// const VariantRow: React.FC<{
//   variant: Variant;
//   onUpdate: (patch: Partial<Variant>) => void;
//   onRemove: () => void;
//   disabled?: boolean;
// }> = ({ variant, onUpdate, onRemove, disabled }) => (
//   <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-3 items-center p-4 border border-muted/20 rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors">
//     <Input
//       value={variant.title ?? ""}
//       onChange={(e) => onUpdate({ title: e.target.value })}
//       placeholder="Variant name (e.g., Blue, Large)"
//       disabled={disabled}
//     />
//     <Input
//       type="number"
//       value={variant.price?.toString() ?? ""}
//       onChange={(e) => onUpdate({ price: Number(e.target.value) })}
//       placeholder="Price"
//       disabled={disabled}
//     />
//     <Input
//       type="number"
//       value={variant.stock?.toString() ?? ""}
//       onChange={(e) => onUpdate({ stock: Number(e.target.value) })}
//       placeholder="Stock"
//       disabled={disabled}
//     />
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={onRemove}
//       disabled={disabled}
//       className="hover:bg-destructive/10 hover:text-destructive transition-colors"
//     >
//       <X className="w-4 h-4" />
//     </Button>
//   </div>
// );

// /**
//  * Empty state component
//  */
// const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({
//   icon,
//   message,
// }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-center">
//     <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
//       {icon}
//     </div>
//     <p className="text-sm text-muted-foreground">{message}</p>
//   </div>
// );

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function AdminProductPanel({
//   initialProduct,
//   categories = [],
//   isNew = false,
// }: Props) {
//   // ==================== STATE ====================

//   // Main product state with safe defaults
//   const safeInitial = initialProduct ?? {};

// const [product, setProduct] = useState<Partial<Product>>({
//   id: safeInitial.id ?? "",
//   productName: safeInitial.productName ?? "",
//   brand: safeInitial.brand ?? "",
//   model: safeInitial.model ?? "",
//   subCategory: safeInitial.subCategory ?? "",
//   description: safeInitial.description ?? "",
//   features: safeInitial.features ?? [],
//   pricing: safeInitial.pricing ?? {
//     price: 0,
//     currency: "INR",
//     discount: 0,
//     inStock: true,
//     stockQuantity: 0,
//   },
//   specifications: safeInitial.specifications ?? { general: {}, technical: {} },
//   tags: safeInitial.tags ?? [],
//   variants: safeInitial.variants ?? [],
//   productImages: safeInitial.productImages ?? [],
//   productCategories: safeInitial.productCategories ?? [],
//   slug: safeInitial.slug ?? "",
// });

//   // const [product, setProduct] = useState<Partial<Product>>({
//   //   id: initialProduct.id ?? "",
//   //   productName: initialProduct.productName ?? "",
//   //   brand: initialProduct.brand ?? "",
//   //   model: initialProduct.model ?? "",
//   //   subCategory: initialProduct.subCategory ?? "",
//   //   description: initialProduct.description ?? "",
//   //   features: initialProduct.features ?? [],
//   //   pricing: initialProduct.pricing ?? {
//   //     price: 0,
//   //     currency: "INR",
//   //     discount: 0,
//   //     inStock: true,
//   //     stockQuantity: 0,
//   //   },
//   //   specifications: initialProduct.specifications ?? { general: {}, technical: {} },
//   //   tags: initialProduct.tags ?? [],
//   //   variants: initialProduct.variants ?? [],
//   //   productImages: initialProduct.productImages ?? [],
//   //   productCategories: initialProduct.productCategories ?? [],
//   //   slug: initialProduct.slug ?? "", // Fixed: was using tags instead of slug
//   // });

//   // Selected category IDs for multi-select
// const initialSelected = ((initialProduct ?? {}).productCategories ?? []).map(
//   (pc) => pc.categoryId
// );

//   const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialSelected);

//   const [isPending, startTransition] = useTransition();
//   const [uploadingImage, setUploadingImage] = useState(false);

//   const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
//     setProduct((prev) => ({ ...prev, [key]: value }));
//   };

//   const updateNested = (path: string, value: any) => {
//     setProduct((prev) => {
//       const clone = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid mutations
//       const keys = path.split(".");
//       let ref = clone;

//       // Navigate to parent object
//       for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i];
//         if (!ref[key] || typeof ref[key] !== "object") {
//           ref[key] = {};
//         }
//         ref = ref[key];
//       }

//       // Set the final value
//       ref[keys[keys.length - 1]] = value;
//       return clone;
//     });
//   };

//   // ==================== FEATURES ====================

//   const addFeature = () => {
//     setProduct((prev) => ({
//       ...prev,
//       features: [...(prev.features ?? []), ""],
//     }));
//   };

//   const removeFeature = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       features: (prev.features ?? []).filter((_, i) => i !== index),
//     }));
//   };

//   const updateFeature = (index: number, value: string) => {
//     setProduct((prev) => {
//       const updated = [...(prev.features ?? [])];
//       updated[index] = value;
//       return { ...prev, features: updated };
//     });
//   };

//   // ==================== TAGS ====================

//   const addTag = () => {
//     setProduct((prev) => ({
//       ...prev,
//       tags: [...(prev.tags ?? []), ""],
//     }));
//   };

//   const removeTag = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       tags: (prev.tags ?? []).filter((_, i) => i !== index),
//     }));
//   };

//   const updateTag = (index: number, value: string) => {
//     setProduct((prev) => {
//       const updated = [...(prev.tags ?? [])];
//       updated[index] = value;
//       return { ...prev, tags: updated };
//     });
//   };

//   // ==================== IMAGES ====================

//   const addImage = (img: ProductImage) => {
//     setProduct((prev) => ({
//       ...prev,
//       productImages: [...(prev.productImages ?? []), img],
//     }));
//   };

//   const removeImage = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       productImages: (prev.productImages ?? []).filter((_, i) => i !== index),
//     }));
//   };

//   /**
//    * ImageKit upload with loading state
//    */
//   const uploadToImageKit = async (file: File): Promise<{ url: string; fileId: string } | null> => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

//       const response = await fetch(`${baseUrl}/api/imagekit/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data?.error || "Upload failed");
//       }

//       return { url: data.url, fileId: data.fileId };
//     } catch (error: any) {
//       console.error("Image upload error:", error);
//       alert(error.message ?? "Upload failed");
//       return null;
//     }
//   };

//   /**
//    * Handle file input change with loading state
//    */
//   const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploadingImage(true);
//     try {
//       const uploaded = await uploadToImageKit(file);
//       if (uploaded) {
//         addImage({ url: uploaded.url, fileId: uploaded.fileId });
//       }
//     } finally {
//       setUploadingImage(false);
//       e.target.value = ""; // Reset input
//     }
//   };

//   // ==================== VARIANTS ====================

//   const addVariant = () => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: [...(prev.variants ?? []), { title: "", price: 0, stock: 0 }],
//     }));
//   };

//   const updateVariant = (index: number, patch: Partial<Variant>) => {
//     setProduct((prev) => {
//       const updated = [...(prev.variants ?? [])];
//       updated[index] = { ...updated[index], ...patch };
//       return { ...prev, variants: updated };
//     });
//   };

//   const removeVariant = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: (prev.variants ?? []).filter((_, i) => i !== index),
//     }));
//   };

//   // ==================== CATEGORIES ====================

//   const toggleCategory = (categoryId: string) => {
//     setSelectedCategoryIds((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   // ==================== SLUG ====================

//   /**
//    * Generate SEO-friendly slug from product name
//    */
//   const generateSlug = () => {
//     const name = product.productName ?? "";
//     const slug = name
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/[\s_-]+/g, "-")
//       .replace(/^-+|-+$/g, "");
//     setField("slug", slug);
//   };

//   // ==================== SAVE ====================

//   /**
//    * Save product with proper loading state
//    */
//   const handleSave = async () => {
//     startTransition(async () => {
//       try {
//         // Build payload
//         const payload: any = { ...product };

//         // Map category IDs to proper format
//         payload.productCategories = selectedCategoryIds.map((id) => ({
//           categoryId: id,
//         }));

//         // Clean up image data
//         payload.productImages = (product.productImages ?? []).map((img, idx) => ({
//           id: img.id,
//           url: img.url,
//           fileId: img.fileId,
//           position: img.position ?? idx,
//         }));

//         const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
//         const url = isNew
//           ? `${baseUrl}/api/admin/products`
//           : `${baseUrl}/api/admin/products/${product.id}`;

//         const response = await fetch(url, {
//           method: isNew ? "POST" : "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           const data = await response.json().catch(() => ({}));
//           throw new Error(data?.error || "Failed to save product");
//         }

//         const saved = await response.json();
//         alert("Product saved successfully!");

//         // Redirect to edit page if creating new product
//         if (isNew && saved?.id) {
//           window.location.href = `/admin/products/${saved.id}`;
//         }
//       } catch (error: any) {
//         console.error("Save error:", error);
//         alert(error.message ?? "Failed to save product");
//       }
//     });
//   };

//   // ==================== RENDER ====================

//   return (
//     <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
//       <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 space-y-6">

//         {/* Header with Back Button */}
//         <div className="flex items-start justify-between gap-4 sm:gap-6">
//           <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
//             {/* Back Button */}
//             <Link href="/admin/products">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//               </Button>
//             </Link>

//             <div className="flex-1 min-w-0">
//               <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
//                 {isNew ? "Create New Product" : "Edit Product"}
//               </h1>
//               <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
//                 {isNew
//                   ? "Fill in the details to create a new product listing"
//                   : "Update product details, pricing, images, and variants"
//                 }
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
//             <Button
//               onClick={generateSlug}
//               variant="outline"
//               disabled={isPending || !product.productName}
//               className="hidden sm:flex gap-2 border-neutral-200 dark:border-neutral-800"
//             >
//               Generate Slug
//             </Button>
//             <Button
//               onClick={handleSave}
//               disabled={isPending}
//               className="gap-2 min-w-[100px] sm:min-w-[120px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
//             >
//               {isPending ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   <span className="hidden sm:inline">Saving...</span>
//                   <span className="sm:hidden">Save</span>
//                 </>
//               ) : (
//                 <>
//                   <span className="hidden sm:inline">{isNew ? "Create Product" : "Save Changes"}</span>
//                   <span className="sm:hidden">Save</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <Card className="rounded-2xl border-muted/20 shadow-sm">
//           <CardHeader className="border-b border-muted/20">
//             <CardTitle className="text-xl">Product Configuration</CardTitle>
//           </CardHeader>

//           <CardContent className="p-6">
//             <Tabs defaultValue="general" className="space-y-6">

//               {/* Tab Navigation */}
//               <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1 bg-muted/50">
//                 <TabsTrigger value="general" className="data-[state=active]:bg-background">
//                   General
//                 </TabsTrigger>
//                 <TabsTrigger value="pricing" className="data-[state=active]:bg-background">
//                   Pricing
//                 </TabsTrigger>
//                 <TabsTrigger value="specs" className="data-[state=active]:bg-background">
//                   Specs
//                 </TabsTrigger>
//                 <TabsTrigger value="images" className="data-[state=active]:bg-background">
//                   Images
//                 </TabsTrigger>
//                 <TabsTrigger value="features" className="data-[state=active]:bg-background">
//                   Features
//                 </TabsTrigger>
//                 <TabsTrigger value="variants" className="data-[state=active]:bg-background">
//                   Variants
//                 </TabsTrigger>
//                 <TabsTrigger value="categories" className="data-[state=active]:bg-background">
//                   Categories
//                 </TabsTrigger>
//                 <TabsTrigger value="tags" className="data-[state=active]:bg-background">
//                   Tags
//                 </TabsTrigger>
//               </TabsList>

//               {/* General Tab */}
//               <TabsContent value="general" className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Product Name *</label>
//                     <Input
//                       value={product.productName ?? ""}
//                       onChange={(e) => setField("productName", e.target.value)}
//                       placeholder="Enter product name"
//                       disabled={isPending}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Brand</label>
//                     <Input
//                       value={product.brand ?? ""}
//                       onChange={(e) => setField("brand", e.target.value)}
//                       placeholder="Enter brand name"
//                       disabled={isPending}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Model</label>
//                     <Input
//                       value={product.model ?? ""}
//                       onChange={(e) => setField("model", e.target.value)}
//                       placeholder="Enter model number"
//                       disabled={isPending}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Sub Category</label>
//                     <Input
//                       value={product.subCategory ?? ""}
//                       onChange={(e) => setField("subCategory", e.target.value)}
//                       placeholder="Enter sub category"
//                       disabled={isPending}
//                     />
//                   </div>
//                   <div className="space-y-2 md:col-span-2">
//                     <label className="text-sm font-medium">URL Slug</label>
//                     <Input
//                       value={product.slug ?? ""}
//                       onChange={(e) => setField("slug", e.target.value)}
//                       placeholder="product-url-slug"
//                       disabled={isPending}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Description</label>
//                   <Textarea
//                     value={product.description ?? ""}
//                     onChange={(e) => setField("description", e.target.value)}
//                     placeholder="Enter detailed product description"
//                     rows={6}
//                     disabled={isPending}
//                     className="resize-none"
//                   />
//                 </div>
//               </TabsContent>

//               {/* Pricing Tab */}
//               <TabsContent value="pricing" className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Price (INR) *</label>
//                     <Input
//                       type="number"
//                       value={product.pricing?.price?.toString() ?? "0"}
//                       onChange={(e) => updateNested("pricing.price", Number(e.target.value))}
//                       placeholder="0.00"
//                       disabled={isPending}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Discount (%)</label>
//                     <Input
//                       type="number"
//                       value={product.pricing?.discount?.toString() ?? "0"}
//                       onChange={(e) => updateNested("pricing.discount", Number(e.target.value))}
//                       placeholder="0"
//                       disabled={isPending}
//                       min="0"
//                       max="100"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Stock Quantity</label>
//                     <Input
//                       type="number"
//                       value={product.pricing?.stockQuantity?.toString() ?? "0"}
//                       onChange={(e) => updateNested("pricing.stockQuantity", Number(e.target.value))}
//                       placeholder="0"
//                       disabled={isPending}
//                       min="0"
//                     />
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Specifications Tab */}
//               <TabsContent value="specs" className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">General Specifications</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications?.general ?? {}).map(([key, value]) => (
//                       <div key={key} className="space-y-2">
//                         <label className="text-sm font-medium capitalize">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </label>
//                         <Input
//                           value={Array.isArray(value) ? value.join(", ") : String(value)}
//                           onChange={(e) => updateNested(`specifications.general.${key}`, e.target.value)}
//                           disabled={isPending}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications?.technical ?? {}).map(([key, value]) => (
//                       <div key={key} className="space-y-2">
//                         <label className="text-sm font-medium capitalize">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </label>
//                         <Input
//                           value={String(value)}
//                           onChange={(e) => updateNested(`specifications.technical.${key}`, e.target.value)}
//                           disabled={isPending}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Images Tab */}
//               <TabsContent value="images" className="space-y-4">
//                 {(product.productImages?.length ?? 0) === 0 && !uploadingImage ? (
//                   <EmptyState
//                     icon={<Package className="w-6 h-6 text-muted-foreground" />}
//                     message="No images added yet. Upload your first product image."
//                   />
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {product.productImages?.map((img, idx) => (
//                       <ImageCard
//                         key={idx}
//                         image={img}
//                         onRemove={() => removeImage(idx)}
//                         disabled={isPending}
//                       />
//                     ))}

//                     {/* Show loading skeleton during upload */}
//                     {uploadingImage && <ImageLoadingSkeleton />}
//                   </div>
//                 )}

//                 {/* Upload Button */}
//                 <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-muted/40 rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/10 hover:border-muted/60 transition-all">
//                   <Upload className="w-8 h-8 text-muted-foreground mb-2" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {uploadingImage ? "Uploading..." : "Upload Image"}
//                   </span>
//                   <span className="text-xs text-muted-foreground mt-1">
//                     PNG, JPG up to 5MB
//                   </span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={handleFileInput}
//                     accept="image/*"
//                     disabled={isPending || uploadingImage}
//                   />
//                 </label>
//               </TabsContent>

//               {/* Features Tab */}
//               <TabsContent value="features" className="space-y-4">
//                 {(product.features?.length ?? 0) === 0 ? (
//                   <EmptyState
//                     icon={<Plus className="w-6 h-6 text-muted-foreground" />}
//                     message="No features added yet. Add key product features."
//                   />
//                 ) : (
//                   <div className="space-y-3">
//                     {product.features?.map((feature, idx) => (
//                       <EditableListItem
//                         key={idx}
//                         value={feature}
//                         onChange={(value) => updateFeature(idx, value)}
//                         onRemove={() => removeFeature(idx)}
//                         placeholder="Enter product feature"
//                         disabled={isPending}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 <Button
//                   onClick={addFeature}
//                   variant="outline"
//                   className="w-full gap-2"
//                   disabled={isPending}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Feature
//                 </Button>
//               </TabsContent>

//               {/* Variants Tab */}
//               <TabsContent value="variants" className="space-y-4">
//                 {(product.variants?.length ?? 0) === 0 ? (
//                   <EmptyState
//                     icon={<Package className="w-6 h-6 text-muted-foreground" />}
//                     message="No variants added yet. Add product variants like size or color."
//                   />
//                 ) : (
//                   <div className="space-y-3">
//                     {product.variants?.map((variant, idx) => (
//                       <VariantRow
//                         key={idx}
//                         variant={variant}
//                         onUpdate={(patch) => updateVariant(idx, patch)}
//                         onRemove={() => removeVariant(idx)}
//                         disabled={isPending}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 <Button
//                   onClick={addVariant}
//                   variant="outline"
//                   className="w-full gap-2"
//                   disabled={isPending}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Variant
//                 </Button>
//               </TabsContent>

//               {/* Categories Tab */}
//               <TabsContent value="categories" className="space-y-4">
//                 {categories.length === 0 ? (
//                   <EmptyState
//                     icon={<Package className="w-6 h-6 text-muted-foreground" />}
//                     message="No categories available. Create categories first."
//                   />
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {categories.map((category) => {
//                       const isSelected = selectedCategoryIds.includes(category.id);
//                       return (
//                         <label
//                           key={category.id}
//                           className={clsx(
//                             "flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all",
//                             "hover:border-primary/50 hover:bg-muted/20",
//                             isSelected && "border-primary bg-primary/5",
//                             isPending && "opacity-50 cursor-not-allowed"
//                           )}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={isSelected}
//                             onChange={() => toggleCategory(category.id)}
//                             disabled={isPending}
//                             className="w-4 h-4"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium truncate">{category.name}</div>
//                             <div className="text-xs text-muted-foreground truncate">
//                               {category.id}
//                             </div>
//                           </div>
//                         </label>
//                       );
//                     })}
//                   </div>
//                 )}
//               </TabsContent>

//               {/* Tags Tab */}
//               <TabsContent value="tags" className="space-y-4">
//                 {(product.tags?.length ?? 0) === 0 ? (
//                   <EmptyState
//                     icon={<Plus className="w-6 h-6 text-muted-foreground" />}
//                     message="No tags added yet. Add tags to improve searchability."
//                   />
//                 ) : (
//                   <div className="space-y-3">
//                     {product.tags?.map((tag, idx) => (
//                       <EditableListItem
//                         key={idx}
//                         value={tag}
//                         onChange={(value) => updateTag(idx, value)}
//                         onRemove={() => removeTag(idx)}
//                         placeholder="Enter tag"
//                         disabled={isPending}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 <Button
//                   onClick={addTag}
//                   variant="outline"
//                   className="w-full gap-2"
//                   disabled={isPending}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Tag
//                 </Button>
//               </TabsContent>

//             </Tabs>
//           </CardContent>
//         </Card>

//         {/* Footer Info */}
//         <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
//           <p>All changes are saved to the database</p>
//           <p>Last updated: {new Date().toLocaleDateString()}</p>
//         </div>

//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useTransition } from "react";
// import {
//   useForm,
//   FormProvider,
//   useFormContext,
//   useFieldArray,
// } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import {
// //   productFormSchema,
// //   type ProductFormValues,
// //   type Category,
// // } from "@/lib/validation/product-schema";

// import {
//   productFormSchema,
//   type ProductFormValues,
// } from "@/lib/validations/product-schema";
// import { nanoid } from "nanoid";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowLeft, Loader2, Plus, Upload, X, Package } from "lucide-react";

// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import {
//   createProductAction,
//   updateProductAction,
// } from "@/lib/actions/admin-actions/prods";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Skeleton } from "@/components/ui/skeleton";
// import clsx from "clsx";
// import { Category } from "@/lib/types/product.types";

// // ============================================================================
// // TYPES FROM YOUR ORIGINAL SNIPPET (frontend-side)
// // ============================================================================

// type ProductImage = {
//   id?: string;
//   url: string;
//   fileId?: string;
//   position?: number;
// };

// type Variant = {
//   id?: string;
//   title: string;
//   price: number;
//   stock: number;
// };

// type ProductCategory = {
//   categoryId: string;
// };

// type Product = {
//   id: string;
//   productName: string;
//   brand: string;
//   model: string;
//   subCategory: string;
//   description: string;
//   features: string[];
//   pricing: {
//     price: number;
//     currency: string;
//     discount: number;
//     inStock: boolean;
//     stockQuantity: number;
//   };
//   specifications?: {
//     general?: Record<string, any>;
//     technical?: Record<string, any>;
//   };
//   tags: string[];
//   variants?: Variant[];
//   productImages: ProductImage[];
//   productCategories: ProductCategory[];
//   slug: string;
// };

// type Props = {
//   initialProduct: Partial<Product>;
//   categories?: Category[];
//   isNew?: boolean;
// };

// // ============================================================================
// // HELPER COMPONENTS
// // ============================================================================

// const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({
//   icon,
//   message,
// }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-center">
//     <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
//       {icon}
//     </div>
//     <p className="text-sm text-muted-foreground">{message}</p>
//   </div>
// );

// // ============================================================================
// // TABS - GENERAL
// // ============================================================================

// const GeneralTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormField
//           control={form.control}
//           name="productName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Name *</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter product name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="brand"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Brand *</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter brand name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="model"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Model</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter model number" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="subCategory"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Sub Category</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter sub category" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       <FormField
//         control={form.control}
//         name="description"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Description</FormLabel>
//             <FormControl>
//               <Textarea
//                 rows={6}
//                 className="resize-none"
//                 placeholder="Enter detailed product description"
//                 {...field}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// };

// // ============================================================================
// // TABS - PRICING
// // ============================================================================

// const PricingTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <FormField
//           control={form.control}
//           name="pricing.price"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Price (INR) *</FormLabel>
//               <FormControl>
//                 <Input type="number" min="0" step="0.01" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="pricing.discount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Discount (%)</FormLabel>
//               <FormControl>
//                 <Input type="number" min="0" max="100" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="pricing.stockQuantity"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Stock Quantity</FormLabel>
//               <FormControl>
//                 <Input type="number" min="0" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // TABS - FEATURES
// // ============================================================================

// const FeaturesTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();
//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "features",
//   });

//   return (
//     <div className="space-y-4">
//       {fields.length === 0 ? (
//         <EmptyState
//           icon={<Plus className="w-6 h-6 text-muted-foreground" />}
//           message="No features added yet. Add key product features."
//         />
//       ) : (
//         <div className="space-y-3">
//           {fields.map((fieldItem, idx) => (
//             <FormField
//               key={fieldItem.id}
//               control={form.control}
//               name={`features.${idx}`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="sr-only">Feature {idx + 1}</FormLabel>
//                   <div className="flex gap-2 items-center">
//                     <FormControl>
//                       <Input placeholder="Enter product feature" {...field} />
//                     </FormControl>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => remove(idx)}
//                       className="hover:bg-destructive/10 hover:text-destructive"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}
//         </div>
//       )}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full gap-2"
//         // onClick={() => append("")}
//       >
//         <Plus className="w-4 h-4" />
//         Add Feature
//       </Button>
//     </div>
//   );
// };

// // ============================================================================
// // TABS - TAGS
// // ============================================================================

// const TagsTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();
//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "productImages",
//   });

//   return (
//     <div className="space-y-4">
//       {fields.length === 0 ? (
//         <EmptyState
//           icon={<Plus className="w-6 h-6 text-muted-foreground" />}
//           message="No tags added yet. Add tags to improve searchability."
//         />
//       ) : (
//         <div className="space-y-3">
//           {fields.map((fieldItem, idx) => (
//             <FormField
//               key={fieldItem.id}
//               control={form.control}
//               name={`tags.${idx}`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="sr-only">Tag {idx + 1}</FormLabel>
//                   <div className="flex gap-2 items-center">
//                     <FormControl>
//                       <Input placeholder="Enter tag" {...field} />
//                     </FormControl>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => remove(idx)}
//                       className="hover:bg-destructive/10 hover:text-destructive"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}
//         </div>
//       )}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full gap-2"
//         onClick={() => append("")}
//       >
//         <Plus className="w-4 h-4" />
//         Add Tag
//       </Button>
//     </div>
//   );
// };

// // ============================================================================
// // TABS - VARIANTS
// // ============================================================================

// const VariantsTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();
//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "variants",
//   });

//   return (
//     <div className="space-y-4">
//       {fields.length === 0 ? (
//         <EmptyState
//           icon={<Package className="w-6 h-6 text-muted-foreground" />}
//           message="No variants added yet. Add product variants like size or color."
//         />
//       ) : (
//         <div className="space-y-3">
//           {fields.map((fieldItem, idx) => (
//             <div
//               key={fieldItem.id}
//               className="grid grid-cols-[2fr,1fr,1fr,auto] gap-3 items-center p-4 border border-muted/20 rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors"
//             >
//               <FormField
//                 control={form.control}
//                 name={`variants.${idx}.title`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="sr-only">Variant title</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Variant name (e.g., Blue, Large)"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`variants.${idx}.price`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="sr-only">Price</FormLabel>
//                     <FormControl>
//                       <Input type="number" placeholder="Price" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`variants.${idx}.stock`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="sr-only">Stock</FormLabel>
//                     <FormControl>
//                       <Input type="number" placeholder="Stock" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => remove(idx)}
//                 className="hover:bg-destructive/10 hover:text-destructive"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full gap-2"
//         onClick={() => append({ title: "", price: 0, stock: 0 })}
//       >
//         <Plus className="w-4 h-4" />
//         Add Variant
//       </Button>
//     </div>
//   );
// };

// // ============================================================================
// // TABS - CATEGORIES
// // ============================================================================

// const CategoriesTab: React.FC<{ categories: Category[] }> = ({
//   categories,
// }) => {
//   const form = useFormContext<ProductFormValues>();
//   const selected = form.watch("productCategories") || [];

//   const toggleCategory = (categoryId: string) => {
//     const exists = selected.some((c) => c.categoryId === categoryId);
//     if (exists) {
//       form.setValue(
//         "productCategories",
//         selected.filter((c) => c.categoryId !== categoryId),
//         { shouldDirty: true }
//       );
//     } else {
//       form.setValue("productCategories", [...selected, { categoryId }], {
//         shouldDirty: true,
//       });
//     }
//   };

//   if (categories.length === 0) {
//     return (
//       <EmptyState
//         icon={<Package className="w-6 h-6 text-muted-foreground" />}
//         message="No categories available. Create categories first."
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//         {categories.map((category) => {
//           const isSelected = selected.some((c) => c.categoryId === category.id);
//           return (
//             <label
//               key={category.id}
//               className={clsx(
//                 "flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all",
//                 "hover:border-primary/50 hover:bg-muted/20",
//                 isSelected && "border-primary bg-primary/5"
//               )}
//             >
//               <input
//                 type="checkbox"
//                 className="w-4 h-4"
//                 checked={isSelected}
//                 onChange={() => toggleCategory(category.id)}
//               />
//               <div className="flex-1 min-w-0">
//                 <div className="font-medium truncate">{category.name}</div>
//                 <div className="text-xs text-muted-foreground truncate">
//                   {category.id}
//                 </div>
//               </div>
//             </label>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // TABS - SPECS (dynamic key/value)
// // ============================================================================

// const SpecsTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();
//   const specs = form.watch("specifications") || { general: {}, technical: {} };

//   const updateSpec = (
//     section: "general" | "technical",
//     key: string,
//     value: string
//   ) => {
//     const next = {
//       ...specs,
//       [section]: {
//         ...(specs[section] || {}),
//         [key]: value,
//       },
//     };
//     form.setValue("specifications", next, { shouldDirty: true });
//   };

//   const addSpecField = (section: "general" | "technical") => {
//     const name = window.prompt("Enter field name");
//     if (!name) return;
//     updateSpec(section, name, "");
//   };

//   const removeSpecField = (section: "general" | "technical", key: string) => {
//     const sectionObj = { ...(specs[section] || {}) };
//     delete sectionObj[key];
//     form.setValue(
//       "specifications",
//       { ...specs, [section]: sectionObj },
//       { shouldDirty: true }
//     );
//   };

//   const renderSection = (section: "general" | "technical", label: string) => {
//     const entries = Object.entries(specs[section] || {});
//     return (
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">{label}</h3>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => addSpecField(section)}
//           >
//             <Plus className="w-4 h-4 mr-1" />
//             Add Field
//           </Button>
//         </div>
//         {entries.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No fields added. Click &quot;Add Field&quot; to create one.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {entries.map(([key, value]) => (
//               <div key={`${section}-${key}`} className="space-y-1">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </label>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeSpecField(section, key)}
//                     className="hover:bg-destructive/10 hover:text-destructive"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <Input
//                   value={value}
//                   onChange={(e) => updateSpec(section, key, e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {renderSection("general", "General Specifications")}
//       {renderSection("technical", "Technical Specifications")}
//     </div>
//   );
// };

// // ============================================================================
// // TABS - IMAGES (with DnD)
// // ============================================================================

// const uploadToImageKit = async (
//   file: File
// ): Promise<{ url: string; fileId: string } | null> => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await fetch("/api/imagekit/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data?.error || "Upload failed");
//     }

//     return { url: data.url, fileId: data.fileId };
//   } catch (error: any) {
//     console.error("Image upload error:", error);
//     alert(error.message ?? "Upload failed");
//     return null;
//   }
// };

// const ImagesTab: React.FC = () => {
//   const form = useFormContext<ProductFormValues>();
//   const { fields, append, move, remove } = useFieldArray({
//     control: form.control,
//     name: "productImages",
//   });

//   const [uploading, setUploading] = React.useState(false);

//   const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     try {
//       const uploaded = await uploadToImageKit(file);
//       if (uploaded) {
//         append({
//           id: nanoid(),
//           url: uploaded.url,
//           fileId: uploaded.fileId,
//           position: fields.length,
//         });
//       }
//     } finally {
//       setUploading(false);
//       e.target.value = "";
//     }
//   };

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return;
//     if (result.source.index === result.destination.index) return;
//     move(result.source.index, result.destination.index);

//     const updated = form.getValues("productImages");
//     updated.forEach((img, idx) => {
//       img.position = idx;
//     });
//     form.setValue("productImages", updated, { shouldDirty: true });
//   };

//   return (
//     <div className="space-y-4">
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="product-images" direction="horizontal">
//           {(provided) => (
//             <div
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//             >
//               {fields.length === 0 && !uploading ? (
//                 <EmptyState
//                   icon={<Package className="w-6 h-6 text-muted-foreground" />}
//                   message="No images added yet. Upload your first product image."
//                 />
//               ) : (
//                 fields.map((fieldItem, idx) => (
//                   <Draggable
//                     key={fieldItem.id}
//                     draggableId={fieldItem.id || String(idx)}
//                     index={idx}
//                   >
//                     {(drag) => (
//                       <div
//                         ref={drag.innerRef}
//                         {...drag.draggableProps}
//                         {...drag.dragHandleProps}
//                         className="relative group rounded-xl overflow-hidden border border-muted/20 bg-muted/5 hover:border-muted/40 transition-all"
//                       >
//                         <div className="aspect-[4/3] relative">
//                           <Image
//                             src={fieldItem.url}
//                             fill
//                             alt="Product image"
//                             className="object-cover"
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={() => remove(idx)}
//                         >
//                           <X className="w-4 h-4 text-white" />
//                         </button>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))
//               )}

//               {uploading && (
//                 <div className="relative rounded-xl overflow-hidden border border-muted/20 bg-muted/5">
//                   <div className="aspect-[4/3] relative flex items-center justify-center">
//                     <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//                   </div>
//                 </div>
//               )}

//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>

//       <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-muted/40 rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/10 hover:border-muted/60 transition-all">
//         <Upload className="w-8 h-8 text-muted-foreground mb-2" />
//         <span className="text-sm font-medium text-muted-foreground">
//           {uploading ? "Uploading..." : "Upload Image"}
//         </span>
//         <span className="text-xs text-muted-foreground mt-1">
//           PNG, JPG up to 5MB
//         </span>
//         <input
//           type="file"
//           className="hidden"
//           onChange={handleFileInput}
//           accept="image/*"
//           disabled={uploading}
//         />
//       </label>
//     </div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function AdminProductPanel({
//   initialProduct,
//   categories = [],
//   isNew = false,
// }: Props) {
//   const [isPending, startTransition] = useTransition();

//   const defaultValues: ProductFormValues = {
//     id: initialProduct.id ?? undefined,
//     productName: initialProduct.productName ?? "",
//     brand: initialProduct.brand ?? "",
//     model: initialProduct.model ?? "",
//     subCategory: initialProduct.subCategory ?? "",
//     description: initialProduct.description ?? "",
//     slug: initialProduct.slug ?? "",

//     features: initialProduct.features ?? [],
//     tags: initialProduct.tags ?? [],

//     pricing: initialProduct.pricing ?? {
//       price: 0,
//       currency: "INR",
//       discount: 0,
//       inStock: true,
//       stockQuantity: 0,
//     },

//     specifications: initialProduct.specifications ?? {
//       general: {},
//       technical: {},
//     },

//     variants: initialProduct.variants ?? [],
//     productImages: (initialProduct.productImages ?? []).map((img, idx) => ({
//       id: img.id,
//       url: img.url,
//       fileId: img.fileId,
//       position: img.position ?? idx,
//     })),
//     productCategories: (initialProduct.productCategories ?? []).map((pc) => ({
//       categoryId: pc.categoryId,
//     })),
//   };

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productFormSchema),
//     defaultValues,
//     mode: "onBlur",
//   });

//   const onSubmit = (values: ProductFormValues) => {
//     startTransition(async () => {
//       try {
//         const payload: ProductFormValues = {
//           ...values,
//           productImages: (values.productImages ?? []).map((img, idx) => ({
//             ...img,
//             position: idx,
//           })),
//         };

//         if (isNew) {
//           const saved = await createProductAction(payload);
//           alert("Product created successfully!");
//           if (saved?.id) {
//             window.location.href = `/admin/products/${saved.id}`;
//           }
//         } else if (values.id) {
//           await updateProductAction(values.id, payload);
//           alert("Product updated successfully!");
//         }
//       } catch (error: any) {
//         console.error(error);
//         alert(error?.message ?? "Failed to save product");
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
//       <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 space-y-6">
//         {/* Header with Back Button */}
//         <div className="flex items-start justify-between gap-4 sm:gap-6">
//           <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
//             <Link href="/admin/products">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//               </Button>
//             </Link>

//             <div className="flex-1 min-w-0">
//               <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
//                 {isNew ? "Create New Product" : "Edit Product"}
//               </h1>
//               <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
//                 {isNew
//                   ? "Fill in the details to create a new product listing"
//                   : "Update product details, pricing, images, and variants"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
//             <Button
//               type="submit"
//               form="product-form"
//               disabled={isPending}
//               className="gap-2 min-w-[100px] sm:min-w-[120px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
//             >
//               {isPending ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   <span className="hidden sm:inline">Saving...</span>
//                   <span className="sm:hidden">Save</span>
//                 </>
//               ) : (
//                 <>
//                   <span className="hidden sm:inline">
//                     {isNew ? "Create Product" : "Save Changes"}
//                   </span>
//                   <span className="sm:hidden">Save</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <Card className="rounded-2xl border-muted/20 shadow-sm">
//           <CardHeader className="border-b border-muted/20">
//             <CardTitle className="text-xl">Product Configuration</CardTitle>
//           </CardHeader>

//           <CardContent className="p-6">
//             <FormProvider {...form}>
//               <Form {...form}>
//                 <form
//                   id="product-form"
//                   onSubmit={form.handleSubmit(onSubmit)}
//                   className="space-y-6"
//                 >
//                   <Tabs defaultValue="general" className="space-y-6">
//                     <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1 bg-muted/50">
//                       <TabsTrigger value="general">General</TabsTrigger>
//                       <TabsTrigger value="pricing">Pricing</TabsTrigger>
//                       <TabsTrigger value="specs">Specs</TabsTrigger>
//                       <TabsTrigger value="images">Images</TabsTrigger>
//                       <TabsTrigger value="features">Features</TabsTrigger>
//                       <TabsTrigger value="variants">Variants</TabsTrigger>
//                       <TabsTrigger value="categories">Categories</TabsTrigger>
//                       <TabsTrigger value="tags">Tags</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="general">
//                       <GeneralTab />
//                     </TabsContent>
//                     <TabsContent value="pricing">
//                       <PricingTab />
//                     </TabsContent>
//                     <TabsContent value="specs">
//                       <SpecsTab />
//                     </TabsContent>
//                     <TabsContent value="images">
//                       <ImagesTab />
//                     </TabsContent>
//                     <TabsContent value="features">
//                       <FeaturesTab />
//                     </TabsContent>
//                     <TabsContent value="variants">
//                       <VariantsTab />
//                     </TabsContent>
//                     <TabsContent value="categories">
//                       <CategoriesTab categories={categories} />
//                     </TabsContent>
//                     <TabsContent value="tags">
//                       <TagsTab />
//                     </TabsContent>
//                   </Tabs>
//                 </form>
//               </Form>
//             </FormProvider>
//           </CardContent>
//         </Card>

//         {/* Footer Info */}
//         <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
//           <p>All changes are saved to the database when you click Save</p>
//           <p>Last updated: {new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useTransition } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Utility Components
// ---------------------------------------------------------------------------

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

const SectionHeader: React.FC<{
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

// ---------------------------------------------------------------------------
// ImageKit Upload Helper
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Form Tabs
// ---------------------------------------------------------------------------

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
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-xl pl-8"
                    placeholder="0.00"
                    {...field}
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
                    className="h-11 rounded-xl pr-8"
                    placeholder="0"
                    {...field}
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
                  className="h-11 rounded-xl"
                  placeholder="0"
                  {...field}
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

const SpecsTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const specs = form.watch("specifications") ?? {
    general: {},
    technical: {},
  };

  const setSpecValue = (
    section: "general" | "technical",
    key: string,
    value: string | string[]
  ) => {
    const next: any = { ...(specs || {}) };
    next[section] = { ...(next[section] || {}), [key]: value };
    form.setValue("specifications", next, { shouldDirty: true });
  };

  const SpecInput: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }> = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <SectionHeader
          title="General Specifications"
          description="Basic product characteristics and attributes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpecInput
            label="Product Name"
            value={specs.general?.productName ?? ""}
            onChange={(v) => setSpecValue("general", "productName", v)}
            placeholder="Official product name"
          />
          <SpecInput
            label="Brand Name"
            value={specs.general?.brandName ?? ""}
            onChange={(v) => setSpecValue("general", "brandName", v)}
            placeholder="Manufacturer brand"
          />
          <SpecInput
            label="Colors"
            value={specs.general?.colors ?? ""}
            onChange={(v) => setSpecValue("general", "colors", v)}
            placeholder="Available colors"
          />
          <SpecInput
            label="Material"
            value={specs.general?.material ?? ""}
            onChange={(v) => setSpecValue("general", "material", v)}
            placeholder="e.g., Aluminum, Plastic"
          />
          <SpecInput
            label="Weight"
            value={specs.general?.weight ?? ""}
            onChange={(v) => setSpecValue("general", "weight", v)}
            placeholder="e.g., 50g"
          />
          <SpecInput
            label="Size (mm)"
            value={specs.general?.sizeMm ?? ""}
            onChange={(v) => setSpecValue("general", "sizeMm", v)}
            placeholder="e.g., 100x50x20"
          />
          <SpecInput
            label="Private Mold"
            value={specs.general?.privateMold ?? ""}
            onChange={(v) => setSpecValue("general", "privateMold", v)}
            placeholder="Yes/No"
          />
          <SpecInput
            label="Certificates"
            value={
              Array.isArray(specs.general?.certificate)
                ? (specs.general.certificate as string[]).join(", ")
                : specs.general?.certificate ?? ""
            }
            onChange={(v) =>
              setSpecValue(
                "general",
                "certificate",
                v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="CE, FCC, RoHS (comma separated)"
          />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Technical Specifications"
          description="Detailed technical information and performance metrics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpecInput
            label="Bluetooth Version"
            value={specs.technical?.bluetoothVersion ?? ""}
            onChange={(v) => setSpecValue("technical", "bluetoothVersion", v)}
            placeholder="e.g., 5.3"
          />
          <SpecInput
            label="Wireless Delay Time"
            value={specs.technical?.wirelessDelayTime ?? ""}
            onChange={(v) => setSpecValue("technical", "wirelessDelayTime", v)}
            placeholder="e.g., 65ms"
          />
          <SpecInput
            label="Waterproof Standard"
            value={specs.technical?.waterproofStandard ?? ""}
            onChange={(v) => setSpecValue("technical", "waterproofStandard", v)}
            placeholder="e.g., IPX7"
          />
          <SpecInput
            label="Chipset"
            value={specs.technical?.chipset ?? ""}
            onChange={(v) => setSpecValue("technical", "chipset", v)}
            placeholder="e.g., Qualcomm QCC3040"
          />
          <SpecInput
            label="Battery Capacity"
            value={specs.technical?.batteryCapacity ?? ""}
            onChange={(v) => setSpecValue("technical", "batteryCapacity", v)}
            placeholder="e.g., 300mAh"
          />
          <SpecInput
            label="Use Time"
            value={specs.technical?.useTime ?? ""}
            onChange={(v) => setSpecValue("technical", "useTime", v)}
            placeholder="e.g., 6 hours"
          />
          <SpecInput
            label="Standby Time"
            value={specs.technical?.standbyTime ?? ""}
            onChange={(v) => setSpecValue("technical", "standbyTime", v)}
            placeholder="e.g., 120 hours"
          />
        </div>
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
                  onChange={() => toggleCategory(category.name)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  ID: {category.id}
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminProductPanel({
  initialProduct={},
  categories = [],
  isNew = false,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const defaultValues: ProductFormValues = {
    id: (initialProduct.id as string) ?? undefined,
    productName: initialProduct.productName ?? "",
    brand: initialProduct.brand ?? "",
    model: initialProduct.model ?? "",
    subCategory: initialProduct.subCategory ?? "",
    description: initialProduct.description ?? "",
    slug: initialProduct.slug ?? "",
    features: initialProduct.features ?? [],
    tags: initialProduct.tags ?? [],
    categories: initialProduct.categories ?? [], // category names
    pricing: initialProduct.pricing ?? {
      price: 0,
      currency: "INR",
      discount: 0,
      inStock: true,
      stockQuantity: 0,
    },
    specifications: initialProduct?.specifications ?? {
      // Add ?
      general: {
        productName: "",
        brandName: "",
        colors: "",
        material: "",
        weight: "",
        sizeMm: "",
        privateMold: "",
        certificate: [],
      },
      technical: {
        bluetoothVersion: "",
        wirelessDelayTime: "",
        waterproofStandard: "",
        chipset: "",
        batteryCapacity: "",
        useTime: "",
        standbyTime: "",
      },
    },
    productImages: (initialProduct?.productImages ?? []).map((img) => ({
      // Add ?
      url: img.url,
      fileId: img.fileId,
    })),
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = (values: ProductFormValues) => {
    startTransition(() => {
      (async () => {
        try {
          const payload = { ...values };

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

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button
              type="submit"
              form="product-form"
              disabled={isPending}
              className="gap-2 min-w-[100px] sm:min-w-[120px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <span className="hidden sm:inline">
                  {isNew ? "Create Product" : "Save Changes"}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <Card className="rounded-2xl border-muted/20 shadow-sm">
          <CardHeader className="border-b border-muted/20">
            <CardTitle className="text-xl">Product Configuration</CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <FormProvider {...form}>
              <Form {...form}>
                <form
                  id="product-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                        <SpecsTab />
                      </TabsContent>

                      <TabsContent value="images" className="mt-0">
                        <ImagesTab />
                      </TabsContent>

                      <TabsContent value="features" className="mt-0">
                        <FeaturesTab />
                      </TabsContent>

                      <TabsContent value="categories" className="mt-0">
                        <CategoriesTab categories={categories} />
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
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
