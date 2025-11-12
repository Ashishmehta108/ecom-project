"use client";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-md bg-white dark:bg-neutral-900 rounded-xl"
          >
            <CardContent className="p-0">
              {/* Favorite Button Skeleton */}
              <div className="absolute z-10 top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
              </div>

              {/* Image Container Skeleton */}
              <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-700 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-neutral-600 animate-pulse"></div>
                </div>
              </div>

              {/* Product Details Skeleton */}
              <div className="p-6 bg-white dark:bg-neutral-900">
                {/* Category Pills Skeleton */}
                <div className="flex gap-1 mb-3">
                  <div className="w-16 h-6 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                  <div className="w-14 h-6 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                  <div className="w-20 h-6 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                </div>

                {/* Product Name Skeleton */}
                <div className="w-3/4 h-7 bg-gray-200 dark:bg-neutral-700 rounded-md animate-pulse mb-2"></div>

                {/* Rating Skeleton */}
                <div className="flex items-center mt-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gray-200 dark:bg-neutral-700 rounded-sm animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="w-16 h-4 ml-2 bg-gray-200 dark:bg-neutral-700 rounded-md animate-pulse"></div>
                </div>

                {/* Price and Stock Status Skeleton */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="w-20 h-7 bg-gray-200 dark:bg-neutral-700 rounded-md animate-pulse"></div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                </div>

                {/* Button Skeleton */}
                <div className="mt-4 w-full h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

type Product = {
  id: string;
  name: string;
  company: string;
  description: string;
  featured: boolean;
  image: string;
  price: number;
  clerkId: string;
};

function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    (async () => {
      console.log(search);
      const res = await fetch(`/api/prods?search=${search}`);
      const data = await res.json();
      console.log(data);
      setProducts(data);
    })();
  }, [search]);

  const totalProducts = products.length;
  const searchTerm = search ? `&search=${search}` : "";
  return (
    <>
      {/* HEADER */}
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg text-gray-900 dark:text-neutral-100">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          {/* <div className="flex gap-x-4">
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button> */}
          {/* <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button> */}
          {/* </div> */}
        </div>
        <Separator className="mt-4 dark:bg-neutral-800" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <ProductsGridSkeleton count={6} />
        ) : layout === "grid" ? (
          //@ts-ignore
          <ProductsGrid products={products} />
        ) : (
          //@
          <ProductsList
            products={products.map((product) => ({
              ...product,
              type: (product as any).type ?? "",
              areaOfUse: (product as any).areaOfUse ?? "",
            }))}
          />
        )}
      </div>
    </>
  );
}
export default ProductsContainer;
