import Link from "next/link";
import Container from "@/components/giobal/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/SortFilter";
import { SortFilter } from "@/components/products/SortFilter";
import { filterProducts } from "@/lib/actions/productActions";
import { getUserSession } from "@/server";

type SearchParams = {
  category?: string;
  sort?: string;
  search?: string;
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) || {};
  const session = await getUserSession();
  const search = params.search ?? undefined;
  const sort = params.sort ?? undefined;
  const category = params.category ?? undefined;
  const { products, categories } = await filterProducts({
    category: category === "all" ? undefined : category,
    search,
    sort,
  });

  const activeCategory = category || "all";
  const activeSort = sort || "featured";
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Container className="py-8 md:py-12">
        <div className="mb-8 space-y-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Products
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {products.length} {products.length === 1 ? "item" : "items"}
              </p>
            </div>
            {search && (
              <Link
                href="/products"
                className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Clear search
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
            />
            <SortFilter activeSort={activeSort} />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              No products found
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Try adjusting your filters or search terms
            </p>
            <Link
              href="/products"
              className="mt-6 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  productName: product.productName,
                  brand: product.brand,
                  subCategory: product.subCategory,
                  description: product.description,
                  features: product.features,
                  pricing: product.pricing,
                  productImages: product.productImages
                    .filter((img) => img.position !== null)
                    .map((img) => ({
                      url: img.url,
                      position: img.position as string,
                    })),
                }}
                userId={session?.user.id!}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
