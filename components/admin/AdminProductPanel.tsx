// // components/admin/AdminProductPanel.tsx
// "use client";

// import React, { useState, useTransition } from "react";
// import { Product, Category, ProductImage, Variant } from "@/types/product";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Image from "next/image";
// import { X, Plus, Upload } from "lucide-react";
// import { slugify } from "@/utils/slugify";
// import { toast } from "sonner";
// import clsx from "clsx";

// type Props = {
//   initialProduct: Partial<Product>;
//   categories?: Category[];
//   isNew?: boolean;
// };

// export default function AdminProductPanel({ initialProduct, categories = [], isNew = false }: Props) {
//   // hydrate state safely with defaults
//   const [product, setProduct] = useState<Partial<Product>>({
//     id: initialProduct.id ?? "",
//     productName: initialProduct.productName ?? "",
//     brand: initialProduct.brand ?? "",
//     model: initialProduct.model ?? "",
//     subCategory: initialProduct.subCategory ?? "",
//     description: initialProduct.description ?? "",
//     features: initialProduct.features ?? [],
//     pricing: initialProduct.pricing ?? { price: 0, currency: "INR", discount: 0, inStock: true, stockQuantity: 0 },
//     specifications: initialProduct.specifications ?? { general: {}, technical: {} },
//     tags: initialProduct.tags ?? [],
//     variants: initialProduct.variants ?? [],
//     productImages: initialProduct.productImages ?? [],
//     productCategories: initialProduct.productCategories ?? [],
//     slug: initialProduct.slug ?? "",
//   });

//   // local UI-only categories mapping (selected category ids)
//   const initialSelected = (initialProduct.productCategories ?? []).map((pc) => pc.categoryId);
//   const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialSelected);

//   const [isPending, startTransition] = useTransition();

//   // helpers
//   const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
//     setProduct((p) => ({ ...(p as any), [key]: value }));
//   };

//   const updateNested = (path: string, value: any) => {
//     setProduct((prev) => {
//       const next = { ...(prev as any) };
//       const keys = path.split(".");
//       let ref = next;
//       keys.slice(0, -1).forEach((k) => {
//         ref[k] = { ...(ref[k] ?? {}) };
//         ref = ref[k];
//       });
//       ref[keys[keys.length - 1]] = value;
//       return next;
//     });
//   };

//   // features
//   const addFeature = () => setProduct((p) => ({ ...(p as any), features: [...(p.features ?? []), ""] }));
//   const removeFeature = (i: number) =>
//     setProduct((p) => ({ ...(p as any), features: (p.features ?? []).filter((_, idx) => idx !== i) }));
//   const setFeature = (i: number, v: string) =>
//     setProduct((p) => {
//       const arr = [...(p.features ?? [])];
//       arr[i] = v;
//       return { ...(p as any), features: arr };
//     });

//   // tags
//   const addTag = () => setProduct((p) => ({ ...(p as any), tags: [...(p.tags ?? []), ""] }));
//   const removeTag = (i: number) =>
//     setProduct((p) => ({ ...(p as any), tags: (p.tags ?? []).filter((_, idx) => idx !== i) }));
//   const setTag = (i: number, v: string) =>
//     setProduct((p) => {
//       const arr = [...(p.tags ?? [])];
//       arr[i] = v;
//       return { ...(p as any), tags: arr };
//     });

//   // images (productImages)
//   const addImageLocal = (img: { url: string; id?: string; fileId?: string }) =>
//     setProduct((p) => ({ ...(p as any), productImages: [...(p.productImages ?? []), img] }));

//   const removeImageLocal = (idx: number) =>
//     setProduct((p) => ({ ...(p as any), productImages: (p.productImages ?? []).filter((_, i) => i !== idx) }));

//   // ImageKit upload handler
//   const uploadToImageKit = async (file: File) => {
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const res = await fetch("/api/imagekit/upload", {
//         method: "POST",
//         body: fd,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "upload failed");
//       return { url: data.url as string, fileId: data.fileId as string };
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.message ?? "Upload failed");
//       return null;
//     }
//   };

//   const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const uploaded = await uploadToImageKit(file);
//     if (uploaded) {
//       addImageLocal({ url: uploaded.url, fileId: uploaded.fileId });
//       toast.success("Image uploaded");
//     }
//   };

//   // variants UI (simple variants)
//   const addVariant = () =>
//     setProduct((p) => ({ ...(p as any), variants: [...(p.variants ?? []), { title: "", price: 0, stock: 0 }] }));

//   const updateVariant = (idx: number, patch: Partial<Variant>) =>
//     setProduct((p) => {
//       const arr = [...(p.variants ?? [])];
//       arr[idx] = { ...(arr[idx] ?? {}), ...patch };
//       return { ...(p as any), variants: arr };
//     });

//   const removeVariant = (idx: number) =>
//     setProduct((p) => ({ ...(p as any), variants: (p.variants ?? []).filter((_, i) => i !== idx) }));

//   // category selection (multi)
//   const toggleCategory = (catId: string) => {
//     setSelectedCategoryIds((prev) => (prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]));
//   };

//   // slug auto generation
//   const generateSlug = () => {
//     const name = (product.productName ?? "").toString();
//     const s = slugify(name);
//     setField("slug", s);
//   };

//   // Save product (create or update) - calls server endpoints you should provide
//   const save = async () => {
//     startTransition(async () => {
//       try {
//         // Prepare payload
//         const payload: any = { ...(product as any) };

//         // productCategories must be an array of { categoryId }
//         payload.productCategories = selectedCategoryIds.map((id) => ({ categoryId: id }));

//         // productImages: keep url, fileId, id if present
//         payload.productImages = (product.productImages ?? []).map((img: any) => ({
//           id: img.id,
//           url: img.url,
//           fileId: img.fileId,
//           position: img.position ?? 0,
//         }));

//         // Save via REST endpoints (you can replace with server action)
//         const method = isNew ? "POST" : "PUT";
//         const url = isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`;

//         const res = await fetch(url, {
//           method,
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         if (!res.ok) {
//           const data = await res.json().catch(() => ({}));
//           throw new Error(data?.error || "Save failed");
//         }

//         const saved = await res.json();
//         toast.success("Product saved");
//         if (isNew && saved?.id) {
//           // navigate to the product's edit page
//           window.location.href = `/admin/products/${saved.id}`;
//         }
//       } catch (err: any) {
//         console.error(err);
//         toast.error(err.message ?? "Save failed");
//       }
//     });
//   };

//   // small UI helpers
//   const categoryMap = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

//   return (
//     <div className="p-8 max-w-6xl mx-auto space-y-6">
//       <div className="flex items-start justify-between gap-6">
//         <div>
//           <h1 className="text-3xl font-semibold">Product Editor</h1>
//           <p className="text-sm opacity-70 mt-1">Edit product details, categories and images</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <Button onClick={generateSlug} variant="ghost">Generate slug</Button>
//           <Button onClick={save}>{isPending ? "Saving..." : "Save"}</Button>
//         </div>
//       </div>

//       <Card className="rounded-2xl">
//         <CardHeader>
//           <CardTitle>Configuration</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="general" className="space-y-6">
//             <TabsList className="grid grid-cols-6 gap-2">
//               <TabsTrigger value="general">General</TabsTrigger>
//               <TabsTrigger value="pricing">Pricing</TabsTrigger>
//               <TabsTrigger value="specs">Specifications</TabsTrigger>
//               <TabsTrigger value="images">Images</TabsTrigger>
//               <TabsTrigger value="features">Features</TabsTrigger>
//               <TabsTrigger value="variants">Variants</TabsTrigger>
//               <TabsTrigger value="categories">Categories</TabsTrigger>
//               <TabsTrigger value="tags">Tags</TabsTrigger>
//             </TabsList>

//             <TabsContent value="general">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input value={product.productName ?? ""} onChange={(e) => setField("productName", e.target.value)} placeholder="Product Name" />
//                 <Input value={product.brand ?? ""} onChange={(e) => setField("brand", e.target.value)} placeholder="Brand" />
//                 <Input value={product.model ?? ""} onChange={(e) => setField("model", e.target.value)} placeholder="Model" />
//                 <Input value={product.subCategory ?? ""} onChange={(e) => setField("subCategory", e.target.value)} placeholder="Sub Category" />
//                 <Input value={product.slug ?? ""} onChange={(e) => setField("slug", e.target.value)} placeholder="Slug (optional)" />
//               </div>
//               <Textarea value={product.description ?? ""} onChange={(e) => setField("description", e.target.value)} placeholder="Description" className="mt-4" />
//             </TabsContent>

//             <TabsContent value="pricing">
//               <div className="grid grid-cols-3 gap-4">
//                 <Input type="number" value={(product.pricing?.price ?? 0).toString()} onChange={(e) => updateNested("pricing.price", Number(e.target.value))} placeholder="Price" />
//                 <Input type="number" value={(product.pricing?.discount ?? 0).toString()} onChange={(e) => updateNested("pricing.discount", Number(e.target.value))} placeholder="Discount %" />
//                 <Input type="number" value={(product.pricing?.stockQuantity ?? 0).toString()} onChange={(e) => updateNested("pricing.stockQuantity", Number(e.target.value))} placeholder="Stock Quantity" />
//               </div>
//             </TabsContent>

//             <TabsContent value="specs">
//               <h3 className="font-semibold">General</h3>
//               <div className="grid grid-cols-2 gap-3 mt-3">
//                 {Object.entries(product.specifications?.general ?? {}).map(([k, v]) => (
//                   <Input key={k} value={Array.isArray(v) ? v.join(", ") : String(v)} onChange={(e) => updateNested(`specifications.general.${k}`, e.target.value)} placeholder={k} />
//                 ))}
//               </div>

//               <h3 className="font-semibold mt-4">Technical</h3>
//               <div className="grid grid-cols-2 gap-3 mt-3">
//                 {Object.entries(product.specifications?.technical ?? {}).map(([k, v]) => (
//                   <Input key={k} value={String(v)} onChange={(e) => updateNested(`specifications.technical.${k}`, e.target.value)} placeholder={k} />
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="images">
//               <div className="grid grid-cols-3 gap-4">
//                 {(product.productImages ?? []).map((img, idx) => (
//                   <div key={idx} className="relative group rounded-lg overflow-hidden border">
//                     <Image src={img.url} width={320} height={240} alt="img" className="object-cover w-full h-44" />
//                     <button className="absolute top-2 right-2 bg-black/60 p-1 rounded-md" onClick={() => removeImageLocal(idx)}>
//                       <X className="w-4 h-4 text-white" />
//                     </button>
//                   </div>
//                 ))}

//                 <label className="flex flex-col items-center justify-center h-44 border rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20">
//                   <Upload className="h-6 w-6" />
//                   <span className="text-sm">Upload</span>
//                   <input type="file" className="hidden" onChange={handleFileInput} />
//                 </label>
//               </div>
//             </TabsContent>

//             <TabsContent value="features">
//               <div className="space-y-3">
//                 {(product.features ?? []).map((f, idx) => (
//                   <div key={idx} className="flex gap-2">
//                     <Input value={f} onChange={(e) => setFeature(idx, e.target.value)} className="flex-1" />
//                     <Button variant="ghost" onClick={() => removeFeature(idx)}><X /></Button>
//                   </div>
//                 ))}
//                 <Button onClick={addFeature}><Plus /> Add feature</Button>
//               </div>
//             </TabsContent>

//             <TabsContent value="variants">
//               <div className="space-y-3">
//                 {(product.variants ?? []).map((v, idx) => (
//                   <div key={idx} className="grid grid-cols-4 gap-2 items-center">
//                     <Input value={v.title ?? ""} onChange={(e) => updateVariant(idx, { title: e.target.value })} placeholder="Title" />
//                     <Input type="number" value={(v.price ?? 0).toString()} onChange={(e) => updateVariant(idx, { price: Number(e.target.value) })} placeholder="Price" />
//                     <Input type="number" value={(v.stock ?? 0).toString()} onChange={(e) => updateVariant(idx, { stock: Number(e.target.value) })} placeholder="Stock" />
//                     <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => removeVariant(idx)}><X /></Button>
//                     </div>
//                   </div>
//                 ))}
//                 <Button onClick={addVariant}><Plus /> Add variant</Button>
//               </div>
//             </TabsContent>

//             <TabsContent value="categories">
//               <div className="grid grid-cols-3 gap-3">
//                 {categories.map((c) => {
//                   const selected = selectedCategoryIds.includes(c.id);
//                   return (
//                     <label key={c.id} className={clsx("flex items-center gap-3 p-3 border rounded-lg cursor-pointer", selected && "bg-muted/20")}>
//                       <input type="checkbox" checked={selected} onChange={() => toggleCategory(c.id)} />
//                       <div className="flex-1">
//                         <div className="font-medium">{c.name}</div>
//                         <div className="text-sm opacity-60">{c.id}</div>
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             </TabsContent>

//             <TabsContent value="tags">
//               <div className="space-y-2">
//                 {(product.tags ?? []).map((t, idx) => (
//                   <div key={idx} className="flex gap-2">
//                     <Input value={t} onChange={(e) => setTag(idx, e.target.value)} className="flex-1" />
//                     <Button variant="ghost" onClick={() => removeTag(idx)}><X /></Button>
//                   </div>
//                 ))}
//                 <Button onClick={addTag}><Plus /> Add tag</Button>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// components/admin/AdminProductPanel.tsx
"use client";

import React, { useState, useTransition } from "react";
import {
  Product,
  Category,
  ProductImage,
  Variant,
} from "@/lib/types/product.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { X, Plus, Upload } from "lucide-react";
import { slugify } from "@/lib/slugify";
import { toast } from "sonner";
import clsx from "clsx";
// import slugify
type Props = {
  initialProduct: Partial<Product>;
  categories?: Category[];
  isNew?: boolean;
};

export default function AdminProductPanel({
  initialProduct,
  categories = [],
  isNew = false,
}: Props) {
  // hydrate state safely with defaults
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
    specifications: initialProduct.specifications ?? undefined,
    tags: initialProduct.tags ?? [],
    // variants: initialProduct.variants ?? [],
    productImages: initialProduct.images ?? [],
    productCategories: initialProduct.categories ?? [],
    slug: initialProduct.tags ?? "",
  });

  // local UI-only categories mapping (selected category ids)
  const initialSelected = (initialProduct.categories ?? []).map(
    (pc) => pc.categoryId
  );
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<string[]>(initialSelected);

  const [isPending, startTransition] = useTransition();

  // helpers
  const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setProduct((p) => ({ ...(p as any), [key]: value }));
  };

  const updateNested = (path: string, value: any) => {
    setProduct((prev) => {
      const next = { ...(prev as any) };
      const keys = path.split(".");
      let ref = next;
      keys.slice(0, -1).forEach((k) => {
        ref[k] = { ...(ref[k] ?? {}) };
        ref = ref[k];
      });
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // features
  const addFeature = () =>
    setProduct((p) => ({
      ...(p as any),
      features: [...(p.features ?? []), ""],
    }));
  const removeFeature = (i: number) =>
    setProduct((p) => ({
      ...(p as any),
      features: (p.features ?? []).filter((_, idx) => idx !== i),
    }));
  const setFeature = (i: number, v: string) =>
    setProduct((p) => {
      const arr = [...(p.features ?? [])];
      arr[i] = v;
      return { ...(p as any), features: arr };
    });

  // tags
  const addTag = () =>
    setProduct((p) => ({ ...(p as any), tags: [...(p.tags ?? []), ""] }));
  const removeTag = (i: number) =>
    setProduct((p) => ({
      ...(p as any),
      tags: (p.tags ?? []).filter((_, idx) => idx !== i),
    }));
  const setTag = (i: number, v: string) =>
    setProduct((p) => {
      const arr = [...(p.tags ?? [])];
      arr[i] = v;
      return { ...(p as any), tags: arr };
    });

  // images (productImages)
  const addImageLocal = (img: { url: string; id?: string; fileId?: string }) =>
    setProduct((p) => ({
      ...(p as any),
      productImages: [...(p.productImages ?? []), img],
    }));

  const removeImageLocal = (idx: number) =>
    setProduct((p) => ({
      ...(p as any),
      productImages: (p.productImages ?? []).filter((_, i) => i !== idx),
    }));

  // ImageKit upload handler
  const uploadToImageKit = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "upload failed");
      return { url: data.url as string, fileId: data.fileId as string };
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Upload failed");
      return null;
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadToImageKit(file);
    if (uploaded) {
      addImageLocal({ url: uploaded.url, fileId: uploaded.fileId });
      toast.success("Image uploaded");
    }
  };

  // variants UI (simple variants)
  const addVariant = () =>
    setProduct((p) => ({
      ...(p as any),
      variants: [...(p.variants ?? []), { title: "", price: 0, stock: 0 }],
    }));

  const updateVariant = (idx: number, patch: Partial<Variant>) =>
    setProduct((p) => {
      const arr = [...(p.variants ?? [])];
      arr[idx] = { ...(arr[idx] ?? {}), ...patch };
      return { ...(p as any), variants: arr };
    });

  const removeVariant = (idx: number) =>
    setProduct((p) => ({
      ...(p as any),
      variants: (p.variants ?? []).filter((_, i) => i !== idx),
    }));

  // category selection (multi)
  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  // slug auto generation
  const generateSlug = () => {
    const name = (product.productName ?? "").toString();
    const s = slugify(name);
    setField("slug", s);
  };

  // Save product (create or update) - calls server endpoints you should provide
  const save = async () => {
    startTransition(async () => {
      try {
        // Prepare payload
        const payload: any = { ...(product as any) };

        // productCategories must be an array of { categoryId }
        payload.productCategories = selectedCategoryIds.map((id) => ({
          categoryId: id,
        }));

        // productImages: keep url, fileId, id if present
        payload.productImages = (product.productImages ?? []).map(
          (img: any) => ({
            id: img.id,
            url: img.url,
            fileId: img.fileId,
            position: img.position ?? 0,
          })
        );

        // Save via REST endpoints (you can replace with server action)
        const method = isNew ? "POST" : "PUT";
        const url = isNew
          ? "/api/admin/products"
          : `/api/admin/products/${product.id}`;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Save failed");
        }

        const saved = await res.json();
        toast.success("Product saved");
        if (isNew && saved?.id) {
          // navigate to the product's edit page
          window.location.href = `/admin/products/${saved.id}`;
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message ?? "Save failed");
      }
    });
  };

  // small UI helpers
  const categoryMap = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Product Editor</h1>
          <p className="text-sm opacity-70 mt-1">
            Edit product details, categories and images
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={generateSlug} variant="ghost">
            Generate slug
          </Button>
          <Button onClick={save}>{isPending ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-6 gap-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={product.productName ?? ""}
                  onChange={(e) => setField("productName", e.target.value)}
                  placeholder="Product Name"
                />
                <Input
                  value={product.brand ?? ""}
                  onChange={(e) => setField("brand", e.target.value)}
                  placeholder="Brand"
                />
                <Input
                  value={product.model ?? ""}
                  onChange={(e) => setField("model", e.target.value)}
                  placeholder="Model"
                />
                <Input
                  value={product.subCategory ?? ""}
                  onChange={(e) => setField("subCategory", e.target.value)}
                  placeholder="Sub Category"
                />
                <Input
                  value={product.slug ?? ""}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="Slug (optional)"
                />
              </div>
              <Textarea
                value={product.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Description"
                className="mt-4"
              />
            </TabsContent>

            <TabsContent value="pricing">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  value={(product.pricing?.price ?? 0).toString()}
                  onChange={(e) =>
                    updateNested("pricing.price", Number(e.target.value))
                  }
                  placeholder="Price"
                />
                <Input
                  type="number"
                  value={(product.pricing?.discount ?? 0).toString()}
                  onChange={(e) =>
                    updateNested("pricing.discount", Number(e.target.value))
                  }
                  placeholder="Discount %"
                />
                <Input
                  type="number"
                  value={(product.pricing?.stockQuantity ?? 0).toString()}
                  onChange={(e) =>
                    updateNested(
                      "pricing.stockQuantity",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Stock Quantity"
                />
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <h3 className="font-semibold">General</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {Object.entries(product.specifications?.general ?? {}).map(
                  ([k, v]) => (
                    <Input
                      key={k}
                      value={Array.isArray(v) ? v.join(", ") : String(v)}
                      onChange={(e) =>
                        updateNested(
                          `specifications.general.${k}`,
                          e.target.value
                        )
                      }
                      placeholder={k}
                    />
                  )
                )}
              </div>

              <h3 className="font-semibold mt-4">Technical</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {Object.entries(product.specifications?.technical ?? {}).map(
                  ([k, v]) => (
                    <Input
                      key={k}
                      value={String(v)}
                      onChange={(e) =>
                        updateNested(
                          `specifications.technical.${k}`,
                          e.target.value
                        )
                      }
                      placeholder={k}
                    />
                  )
                )}
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid grid-cols-3 gap-4">
                {(product.productImages ?? []).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border"
                  >
                    <Image
                      src={img.url}
                      width={320}
                      height={240}
                      alt="img"
                      className="object-cover w-full h-44"
                    />
                    <button
                      className="absolute top-2 right-2 bg-black/60 p-1 rounded-md"
                      onClick={() => removeImageLocal(idx)}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center h-44 border rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="space-y-3">
                {(product.features ?? []).map((f, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={f}
                      onChange={(e) => setFeature(idx, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" onClick={() => removeFeature(idx)}>
                      <X />
                    </Button>
                  </div>
                ))}
                <Button onClick={addFeature}>
                  <Plus /> Add feature
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="variants">
              <div className="space-y-3">
                {(product.variants ?? []).map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 gap-2 items-center"
                  >
                    <Input
                      value={v.title ?? ""}
                      onChange={(e) =>
                        updateVariant(idx, { title: e.target.value })
                      }
                      placeholder="Title"
                    />
                    <Input
                      type="number"
                      value={(v.price ?? 0).toString()}
                      onChange={(e) =>
                        updateVariant(idx, { price: Number(e.target.value) })
                      }
                      placeholder="Price"
                    />
                    <Input
                      type="number"
                      value={(v.stock ?? 0).toString()}
                      onChange={(e) =>
                        updateVariant(idx, { stock: Number(e.target.value) })
                      }
                      placeholder="Stock"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => removeVariant(idx)}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={addVariant}>
                  <Plus /> Add variant
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-3 gap-3">
                {categories.map((c) => {
                  const selected = selectedCategoryIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={clsx(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer",
                        selected && "bg-muted/20"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCategory(c.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm opacity-60">{c.id}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tags">
              <div className="space-y-2">
                {(product.tags ?? []).map((t, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={t}
                      onChange={(e) => setTag(idx, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" onClick={() => removeTag(idx)}>
                      <X />
                    </Button>
                  </div>
                ))}
                <Button onClick={addTag}>
                  <Plus /> Add tag
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
