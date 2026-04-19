import { getProducts } from "@/lib/actions/product-actions";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/admin-actions/prods";
import ProductsListWrapper from "@/app/products/productWrapper";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const displayProducts = products;

  return (
    <div className="min-h-screen bg-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              All Products
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your product catalog ·{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {displayProducts.length}
              </span>{" "}
              {displayProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="   gap-4 sm:gap-6">
          {/* Add New Product Card */}
          <Link href="/admin/products/new" className="group block">
            <Card className="h-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-sm transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60 cursor-pointer">
              <div className="flex flex-col items-center justify-center h-44 sm:h-48 bg-neutral-50/80 dark:bg-neutral-900/60">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mb-3 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 transition-colors">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-700 dark:text-neutral-300" />
                </div>
                <p className="text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-100">
                  Add New Product
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Create a new listing
                </p>
              </div>
            </Card>
          </Link>
        </div>
        <ProductsListWrapper admin={true} products={displayProducts} />

        {/* Empty state */}
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
                Start by creating your first product to begin managing your
                catalog.
              </p>
              <Link href="/admin/products/new">
                <Button className="gap-2 mt-4 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900">
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
