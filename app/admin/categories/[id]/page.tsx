"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function EditCategory(props: any) {
  const router = useRouter();
  const { id } = use(props.params);

  const [category, setCategory] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Form fields for multilingual name
  const [nameEN, setNameEN] = useState("");
  const [namePT, setNamePT] = useState("");

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
        setNameEN(data.name?.en || "");
        setNamePT(data.name?.pt || "");
      });
  }, [id]);

  function handleImage(e: any) {
    const file = e.target.files[0];
    setNewImage(file);
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

    if (newImage) {
      formData.append("image", newImage);
    }

    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      body: formData,
    });

    router.push("/admin/categories");
  }

  if (!category) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Multilingual Inputs */}
        <div>
          <label className="font-medium">Name (English)</label>
          <Input value={nameEN} onChange={(e) => setNameEN(e.target.value)} />
        </div>

        <div>
          <label className="font-medium">Nome (Português)</label>
          <Input value={namePT} onChange={(e) => setNamePT(e.target.value)} />
        </div>

        {/* Preview Current Image */}
        <p className="font-semibold">Current Image:</p>
        <img
          src={preview || category.imageUrl}
          className="w-32 h-32 rounded-md object-cover bg-gray-200"
          alt="Category"
        />

        {/* Upload New Image */}
        <Input type="file" accept="image/*" onChange={handleImage} />

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
