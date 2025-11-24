
import { getProducts } from "@/lib/actions/product-actions";
// import getProducts
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export default async function AdminProductsPage() {
  // Fetch real products from database
  const products = await getProducts();

  //

  // Use real products if available, otherwise use demo
  const displayProducts = products

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
                      €{product.pricing.price.toLocaleString('en-IN')}
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