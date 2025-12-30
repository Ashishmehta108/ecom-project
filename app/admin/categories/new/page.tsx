"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [nameEN, setNameEN] = useState("");
  const [namePT, setNamePT] = useState("");

  function handleImage(e: any) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "name",
      JSON.stringify({
        en: nameEN,
        pt: namePT,
      })
    );

    if (image) formData.append("image", image);

    await fetch("/api/categories", {
      method: "POST",
      body: formData,
    });

    router.push("/admin/categories");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Create Category
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* English Name */}
            <div className="space-y-2">
              <Label className="text-sm text-neutral-600 dark:text-neutral-300">
                Name (English)
              </Label>
              <Input
                value={nameEN}
                onChange={(e) => setNameEN(e.target.value)}
                placeholder="e.g. Electronics"
                required
              />
            </div>

            {/* Portuguese Name */}
            <div className="space-y-2">
              <Label className="text-sm text-neutral-600 dark:text-neutral-300">
                Nome (Português)
              </Label>
              <Input
                value={namePT}
                onChange={(e) => setNamePT(e.target.value)}
                placeholder="ex.: Eletrônicos"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm text-neutral-600 dark:text-neutral-300">
                Category Image
              </Label>
              <Input type="file" accept="image/*" onChange={handleImage} required />

              {preview && (
                <div className="mt-3">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border">
                    <img src={preview} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full rounded-lg mt-2">
              Create Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
