// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Image from "next/image";
// import { X, Plus, Upload } from "lucide-react";

// export default function AdminProductPanel() {
//   const [product, setProduct] = useState({
//     id: "",
//     productName: "Hoco EW30 Intelligent True Wireless Bluetooth Earphone",
//     brand: "Hoco",
//     model: "EW30",
//     category: "Earphone & Headset",
//     subCategory: "Bluetooth Earphone",
//     description:
//       "Hoco EW30 is a true wireless Bluetooth 5.3 headset with low latency, long standby time, LED indicators, and ergonomic design.",
//     features: [
//       "Bluetooth 5.3",
//       "41–50ms low-latency wireless audio",
//       "Charging case 300mAh, Earbuds 25mAh",
//       "3.5 hours use time",
//       "150 hours standby",
//       "Leader–follower switching",
//       "Summon Siri",
//       "LED battery indicator",
//       "IPX-3 waterproof rating",
//     ],
//     pricing: {
//       price: 660,
//       currency: "INR",
//       discount: 0,
//       inStock: true,
//       stockQuantity: 10,
//     },
//     specifications: {
//       general: {
//         productName: "EW30 Intelligent True Wireless Bluetooth Headset",
//         brandName: "Hoco",
//         colors: "White",
//         material: "ABS",
//         weight: "37g",
//         sizeMm: "51 x 44 x 21 mm",
//         privateMold: "Yes",
//         certificate: ["CE", "FCC", "ROHS"],
//       },
//       technical: {
//         bluetoothVersion: "5.3",
//         wirelessDelayTime: "41-50 ms",
//         waterproofStandard: "IPX-3",
//         chipset: "JL AC6983D2",
//         batteryCapacity: "300mAh, 25mAh",
//         useTime: "3.5 hours",
//         standbyTime: "150 hours",
//       },
//     },
//     images: [
//       { url: "https://ik.imagekit.io/wxwtesflu/hoco_0_A9W4w_AaN.jpeg" },
//       { url: "https://ik.imagekit.io/wxwtesflu/hoco_2_2mJc_07BL.jpeg" },
//     ],
//     tags: ["Bluetooth Earphone", "TWS", "Hoco", "EW30"],
//   });

//   // ---------- UPDATE HELPERS ----------
//   const updateField = (field, value) =>
//     setProduct({ ...product, [field]: value });

//   const updateNested = (path, value) => {
//     const newProduct = { ...product };
//     let ref = newProduct;
//     const keys = path.split(".");
//     keys.slice(0, -1).forEach((k) => {
//       ref[k] = { ...ref[k] };
//       ref = ref[k];
//     });
//     ref[keys[keys.length - 1]] = value;
//     setProduct(newProduct);
//   };

//   // ---------- FEATURES ----------
//   const addFeature = () =>
//     updateField("features", [...product.features, ""]);

//   const removeFeature = (index) =>
//     updateField(
//       "features",
//       product.features.filter((_, i) => i !== index)
//     );

//   const updateFeature = (index, value) => {
//     const updated = [...product.features];
//     updated[index] = value;
//     updateField("features", updated);
//   };

//   // ---------- TAGS ----------
//   const addTag = () => updateField("tags", [...product.tags, ""]);
//   const removeTag = (index) =>
//     updateField("tags", product.tags.filter((_, i) => i !== index));

//   const updateTag = (index, value) => {
//     const updated = [...product.tags];
//     updated[index] = value;
//     updateField("tags", updated);
//   };

//   // ---------- IMAGES ----------
//   const removeImage = (index) =>
//     updateField(
//       "images",
//       product.images.filter((_, i) => i !== index)
//     );

//   const replaceImage = (index, newUrl) => {
//     const updated = [...product.images];
//     updated[index].url = newUrl;
//     updateField("images", updated);
//   };

//   const addImage = (newUrl) =>
//     updateField("images", [...product.images, { url: newUrl }]);

//   return (
//     <div className="p-10 max-w-7xl mx-auto space-y-8">
//       <h1 className="text-4xl font-semibold tracking-tight">Product Editor</h1>

//       <Card className="border rounded-2xl shadow-md">
//         <CardHeader>
//           <CardTitle className="text-xl">Product Configuration</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">

//           {/* ===== TABS ===== */}
//           <Tabs defaultValue="general" className="space-y-6">
//             <TabsList className="grid grid-cols-6 gap-2">
//               <TabsTrigger value="general">General</TabsTrigger>
//               <TabsTrigger value="pricing">Pricing</TabsTrigger>
//               <TabsTrigger value="specs">Specifications</TabsTrigger>
//               <TabsTrigger value="images">Images</TabsTrigger>
//               <TabsTrigger value="features">Features</TabsTrigger>
//               <TabsTrigger value="tags">Tags</TabsTrigger>
//             </TabsList>

//             {/* ================= GENERAL ================= */}
//             <TabsContent value="general" className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input value={product.productName} onChange={(e) => updateField("productName", e.target.value)} placeholder="Product Name" />
//                 <Input value={product.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="Brand" />
//                 <Input value={product.model} onChange={(e) => updateField("model", e.target.value)} placeholder="Model" />
//                 <Input value={product.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Category" />
//                 <Input value={product.subCategory} onChange={(e) => updateField("subCategory", e.target.value)} placeholder="Sub Category" />
//               </div>

//               <Textarea
//                 className="mt-2"
//                 value={product.description}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 placeholder="Product Description"
//               />
//             </TabsContent>

//             {/* ================= PRICING ================= */}
//             <TabsContent value="pricing" className="space-y-4">
//               <div className="grid grid-cols-3 gap-4">
//                 <Input type="number" value={product.pricing.price} onChange={(e) => updateNested("pricing.price", e.target.value)} placeholder="Price" />
//                 <Input type="number" value={product.pricing.discount} onChange={(e) => updateNested("pricing.discount", e.target.value)} placeholder="Discount %" />
//                 <Input type="number" value={product.pricing.stockQuantity} onChange={(e) => updateNested("pricing.stockQuantity", e.target.value)} placeholder="Stock Quantity" />
//               </div>
//             </TabsContent>

//             {/* ================= SPECIFICATIONS (Editable) ================= */}
//             <TabsContent value="specs" className="space-y-8">

//               <h3 className="text-lg font-semibold">General Specifications</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(product.specifications.general).map(([key, val]) => (
//                   <Input
//                     key={key}
//                     value={Array.isArray(val) ? val.join(", ") : val}
//                     onChange={(e) =>
//                       updateNested(
//                         `specifications.general.${key}`,
//                         Array.isArray(val) ? e.target.value.split(",").map((v) => v.trim()) : e.target.value
//                       )
//                     }
//                     placeholder={key}
//                     className="capitalize"
//                   />
//                 ))}
//               </div>

//               <h3 className="text-lg font-semibold">Technical Specifications</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(product.specifications.technical).map(([key, val]) => (
//                   <Input
//                     key={key}
//                     value={val}
//                     onChange={(e) => updateNested(`specifications.technical.${key}`, e.target.value)}
//                     placeholder={key}
//                     className="capitalize"
//                   />
//                 ))}
//               </div>
//             </TabsContent>

//             {/* ================= IMAGES ================= */}
//             <TabsContent value="images" className="space-y-6">
//               <div className="grid grid-cols-3 gap-4">
//                 {product.images.map((img, idx) => (
//                   <div key={idx} className="relative group rounded-xl overflow-hidden border">
//                     <Image src={img.url} width={300} height={300} alt="product image" className="object-cover w-full h-44" />

//                     {/* Delete Button */}
//                     <button
//                       onClick={() => removeImage(idx)}
//                       className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}

//                 {/* Add New Image */}
//                 <label className="flex flex-col items-center justify-center h-44 border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/30 transition">
//                   <Upload className="h-6 w-6" />
//                   <span className="text-sm">Upload Image</span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (!file) return;
//                       const url = URL.createObjectURL(file);
//                       addImage(url);
//                     }}
//                   />
//                 </label>
//               </div>
//             </TabsContent>

//             {/* ================= FEATURES ================= */}
//             <TabsContent value="features" className="space-y-4">
//               {product.features.map((f, idx) => (
//                 <div key={idx} className="flex items-center gap-2">
//                   <Input value={f} onChange={(e) => updateFeature(idx, e.target.value)} className="flex-1" />
//                   <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}

//               <Button variant="secondary" onClick={addFeature} className="gap-2">
//                 <Plus className="h-4 w-4" /> Add Feature
//               </Button>
//             </TabsContent>

//             {/* ================= TAGS ================= */}
//             <TabsContent value="tags" className="space-y-4">
//               {product.tags.map((t, idx) => (
//                 <div key={idx} className="flex items-center gap-2">
//                   <Input value={t} onChange={(e) => updateTag(idx, e.target.value)} className="flex-1" />
//                   <Button variant="ghost" size="icon" onClick={() => removeTag(idx)}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}

//               <Button variant="secondary" onClick={addTag} className="gap-2">
//                 <Plus className="h-4 w-4" /> Add Tag
//               </Button>
//             </TabsContent>

//           </Tabs>

//           {/* SAVE BUTTON */}
//           <div className="flex justify-end mt-10">
//             <Button className="px-8 py-2 text-md rounded-xl">Save Product</Button>
//           </div>

//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { getProducts } from "@/lib/actions/product-actions";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export default async function AdminProductsPage() {
  // Fetch real products from database
  const products = await getProducts();

  // Demo products for display (remove this when you have real data)
  const demoProducts = [
    {
      id: "1",
      productName: "Sony WH-1000XM5 Wireless Headphones",
      brand: "Sony",
      model: "WH-1000XM5",
      pricing: { price: 29990 },
      productImages: [{ url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop" }]
    },
    {
      id: "2",
      productName: "Apple MacBook Pro 14-inch",
      brand: "Apple",
      model: "M3 Pro",
      pricing: { price: 199900 },
      productImages: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop" }]
    },
    {
      id: "3",
      productName: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      model: "S24 Ultra",
      pricing: { price: 124999 },
      productImages: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop" }]
    },
    {
      id: "4",
      productName: "Canon EOS R6 Mark II Camera",
      brand: "Canon",
      model: "EOS R6 II",
      pricing: { price: 249999 },
      productImages: [{ url: "https://images.unsplash.com/photo-1606980707477-594015bbd5f5?w=400&h=300&fit=crop" }]
    },
    {
      id: "5",
      productName: "Dell XPS 15 Laptop",
      brand: "Dell",
      model: "XPS 15 9530",
      pricing: { price: 159990 },
      productImages: [{ url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop" }]
    },
    {
      id: "6",
      productName: "Logitech MX Master 3S Mouse",
      brand: "Logitech",
      model: "MX Master 3S",
      pricing: { price: 8995 },
      productImages: [{ url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop" }]
    },
    {
      id: "7",
      productName: "LG UltraGear 27-inch Gaming Monitor",
      brand: "LG",
      model: "27GP850",
      pricing: { price: 32990 },
      productImages: [{ url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop" }]
    },
    {
      id: "8",
      productName: "Bose QuietComfort Earbuds II",
      brand: "Bose",
      model: "QC Earbuds II",
      pricing: { price: 24900 },
      productImages: [{ url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop" }]
    },
    {
      id: "9",
      productName: "iPad Pro 12.9-inch M2",
      brand: "Apple",
      model: "iPad Pro M2",
      pricing: { price: 112900 },
      productImages: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop" }]
    }
  ];

  // Use real products if available, otherwise use demo
  const displayProducts = products.length > 0 ? products : demoProducts;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Container with consistent spacing */}
      <div className="p-10 max-w-[1100px] mx-auto space-y-8">
        
        {/* Header Section with Add Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              All Products
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your product catalog · {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <Link href="/admin/products/new">
            <Button 
              className="gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
        </div>

        {/* Products Grid - Optimized for mobile and desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          
          {/* Add New Product Card - Always first */}
          <Link 
            href="/admin/products/new"
            className="group block"
          >
            <Card className="h-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 cursor-pointer overflow-hidden">
              <div className="flex flex-col items-center justify-center h-44 sm:h-48 lg:h-52 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mb-3 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 transition-colors">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-600 dark:text-neutral-400" />
                </div>
                <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300">
                  Add New Product
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Create a new listing
                </p>
              </div>
            </Card>
          </Link>

          {/* Existing Products */}
          {displayProducts.map((product) => (
            <Link 
              key={product.id} 
              href={`/admin/products/${product.id}`}
              className="group block"
            >
              <Card className="h-full border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm transition-all duration-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer overflow-hidden">
                
                {/* Product Image - Responsive sizing */}
                {product.productImages?.[0]?.url ? (
                  <div className="relative w-full h-44 sm:h-48 lg:h-52 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <Image
                      src={product.productImages[0].url}
                      alt={product.productName}
                      fill
                      className="object-cover group-hover:opacity-95 transition-opacity"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-44 sm:h-48 lg:h-52 bg-neutral-100 dark:bg-neutral-900">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-300 dark:text-neutral-700" />
                  </div>
                )}

                {/* Card Content - Optimized spacing */}
                <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug mb-1">
                    {product.productName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-1">
                  {/* Brand */}
                  {product.brand && (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {product.brand}
                    </p>
                  )}
                  
                  {/* Model */}
                  {product.model && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
                      Model: {product.model}
                    </p>
                  )}

                  {/* Price - if available */}
                  {product.pricing?.price && (
                    <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 pt-1 sm:pt-2">
                      ₹{product.pricing.price.toLocaleString('en-IN')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <Package className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <div className="text-center space-y-3 px-4">
              <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100">
                No products yet
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                Start by creating your first product to begin managing your catalog
              </p>
              <Link href="/admin/products/new">
                <Button className="gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 mt-4">
                  <Plus className="w-4 h-4" />
                  Create First Product
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}