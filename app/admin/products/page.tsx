  "use client";

  import { useState } from "react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
  import Image from "next/image";
  import { X, Plus, Upload } from "lucide-react";

  export default function AdminProductPanel() {
    const [product, setProduct] = useState({
      id: "",
      productName: "Hoco EW30 Intelligent True Wireless Bluetooth Earphone",
      brand: "Hoco",
      model: "EW30",
      category: "Earphone & Headset",
      subCategory: "Bluetooth Earphone",
      description:
        "Hoco EW30 is a true wireless Bluetooth 5.3 headset with low latency, long standby time, LED indicators, and ergonomic design.",
      features: [
        "Bluetooth 5.3",
        "41–50ms low-latency wireless audio",
        "Charging case 300mAh, Earbuds 25mAh",
        "3.5 hours use time",
        "150 hours standby",
        "Leader–follower switching",
        "Summon Siri",
        "LED battery indicator",
        "IPX-3 waterproof rating",
      ],
      pricing: {
        price: 660,
        currency: "INR",
        discount: 0,
        inStock: true,
        stockQuantity: 10,
      },
      specifications: {
        general: {
          productName: "EW30 Intelligent True Wireless Bluetooth Headset",
          brandName: "Hoco",
          colors: "White",
          material: "ABS",
          weight: "37g",
          sizeMm: "51 x 44 x 21 mm",
          privateMold: "Yes",
          certificate: ["CE", "FCC", "ROHS"],
        },
        technical: {
          bluetoothVersion: "5.3",
          wirelessDelayTime: "41-50 ms",
          waterproofStandard: "IPX-3",
          chipset: "JL AC6983D2",
          batteryCapacity: "300mAh, 25mAh",
          useTime: "3.5 hours",
          standbyTime: "150 hours",
        },
      },
      images: [
        { url: "https://ik.imagekit.io/wxwtesflu/hoco_0_A9W4w_AaN.jpeg" },
        { url: "https://ik.imagekit.io/wxwtesflu/hoco_2_2mJc_07BL.jpeg" },
      ],
      tags: ["Bluetooth Earphone", "TWS", "Hoco", "EW30"],
    });

    // ---------- UPDATE HELPERS ----------
    const updateField = (field, value) =>
      setProduct({ ...product, [field]: value });

    const updateNested = (path, value) => {
      const newProduct = { ...product };
      let ref = newProduct;
      const keys = path.split(".");
      keys.slice(0, -1).forEach((k) => {
        ref[k] = { ...ref[k] };
        ref = ref[k];
      });
      ref[keys[keys.length - 1]] = value;
      setProduct(newProduct);
    };

    // ---------- FEATURES ----------
    const addFeature = () =>
      updateField("features", [...product.features, ""]);

    const removeFeature = (index) =>
      updateField(
        "features",
        product.features.filter((_, i) => i !== index)
      );

    const updateFeature = (index, value) => {
      const updated = [...product.features];
      updated[index] = value;
      updateField("features", updated);
    };

    // ---------- TAGS ----------
    const addTag = () => updateField("tags", [...product.tags, ""]);
    const removeTag = (index) =>
      updateField("tags", product.tags.filter((_, i) => i !== index));

    const updateTag = (index, value) => {
      const updated = [...product.tags];
      updated[index] = value;
      updateField("tags", updated);
    };

    // ---------- IMAGES ----------
    const removeImage = (index) =>
      updateField(
        "images",
        product.images.filter((_, i) => i !== index)
      );

    const replaceImage = (index, newUrl) => {
      const updated = [...product.images];
      updated[index].url = newUrl;
      updateField("images", updated);
    };

    const addImage = (newUrl) =>
      updateField("images", [...product.images, { url: newUrl }]);

    return (
      <div className="p-10 max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight">Product Editor</h1>

        <Card className="border rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Product Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-6">

            {/* ===== TABS ===== */}
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid grid-cols-6 gap-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              {/* ================= GENERAL ================= */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input value={product.productName} onChange={(e) => updateField("productName", e.target.value)} placeholder="Product Name" />
                  <Input value={product.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="Brand" />
                  <Input value={product.model} onChange={(e) => updateField("model", e.target.value)} placeholder="Model" />
                  <Input value={product.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Category" />
                  <Input value={product.subCategory} onChange={(e) => updateField("subCategory", e.target.value)} placeholder="Sub Category" />
                </div>

                <Textarea
                  className="mt-2"
                  value={product.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Product Description"
                />
              </TabsContent>

              {/* ================= PRICING ================= */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Input type="number" value={product.pricing.price} onChange={(e) => updateNested("pricing.price", e.target.value)} placeholder="Price" />
                  <Input type="number" value={product.pricing.discount} onChange={(e) => updateNested("pricing.discount", e.target.value)} placeholder="Discount %" />
                  <Input type="number" value={product.pricing.stockQuantity} onChange={(e) => updateNested("pricing.stockQuantity", e.target.value)} placeholder="Stock Quantity" />
                </div>
              </TabsContent>

              {/* ================= SPECIFICATIONS (Editable) ================= */}
              <TabsContent value="specs" className="space-y-8">

                <h3 className="text-lg font-semibold">General Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications.general).map(([key, val]) => (
                    <Input
                      key={key}
                      value={Array.isArray(val) ? val.join(", ") : val}
                      onChange={(e) =>
                        updateNested(
                          `specifications.general.${key}`,
                          Array.isArray(val) ? e.target.value.split(",").map((v) => v.trim()) : e.target.value
                        )
                      }
                      placeholder={key}
                      className="capitalize"
                    />
                  ))}
                </div>

                <h3 className="text-lg font-semibold">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications.technical).map(([key, val]) => (
                    <Input
                      key={key}
                      value={val}
                      onChange={(e) => updateNested(`specifications.technical.${key}`, e.target.value)}
                      placeholder={key}
                      className="capitalize"
                    />
                  ))}
                </div>
              </TabsContent>

              {/* ================= IMAGES ================= */}
              <TabsContent value="images" className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border">
                      <Image src={img.url} width={300} height={300} alt="product image" className="object-cover w-full h-44" />

                      {/* Delete Button */}
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Image */}
                  <label className="flex flex-col items-center justify-center h-44 border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/30 transition">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        addImage(url);
                      }}
                    />
                  </label>
                </div>
              </TabsContent>

              {/* ================= FEATURES ================= */}
              <TabsContent value="features" className="space-y-4">
                {product.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={f} onChange={(e) => updateFeature(idx, e.target.value)} className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="secondary" onClick={addFeature} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Feature
                </Button>
              </TabsContent>

              {/* ================= TAGS ================= */}
              <TabsContent value="tags" className="space-y-4">
                {product.tags.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={t} onChange={(e) => updateTag(idx, e.target.value)} className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeTag(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="secondary" onClick={addTag} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Tag
                </Button>
              </TabsContent>

            </Tabs>

            {/* SAVE BUTTON */}
            <div className="flex justify-end mt-10">
              <Button className="px-8 py-2 text-md rounded-xl">Save Product</Button>
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }
