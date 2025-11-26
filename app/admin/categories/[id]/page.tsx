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

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then(setCategory);
  }, [id]);

  function handleImage(e: any) {
    const file = e.target.files[0];
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const data = new FormData(e.target);

    if (newImage) data.append("image", newImage);

    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      body: data,
    });

    router.push("/admin/categories");
  }

  if (!category) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" defaultValue={category.name} />

        <p className="font-semibold">Current Image:</p>
        <img
          src={preview || category.imageUrl}
          className="w-32 h-32 rounded-md object-cover"
        />

        <Input type="file" accept="image/*" onChange={handleImage} />

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
