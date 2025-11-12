import Link from "next/link";
import Container from "@/components/giobal/Container";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, Sparkles, ShieldCheck, Heart } from "lucide-react";

type ProductCategory =
  | "laptops"
  | "phones"
  | "audio"
  | "wearables"
  | "accessories"
  | "monitors"
  | "tablets";

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  highlights: string[];
  badge?: string;
  inStock: boolean;
  popularity: number;
  releaseDate: string;
  tags: string[];
};

const productCatalog: Product[] = [
  {
    id: "aurora-x1",
    name: "Aurora X1 Gaming Laptop",
    category: "laptops",
    price: 139999,
    rating: 4.8,
    reviews: 214,
    description:
      "Built for creators and gamers with 14th gen Intel i9, RTX 4080 graphics, and a 240Hz QHD display.",
    image:
      "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Intel i9 14th Gen", "RTX 4080 12GB", "1TB NVMe SSD"],
    badge: "Bestseller",
    inStock: true,
    popularity: 98,
    releaseDate: "2024-03-12",
    tags: ["gaming", "creator", "rgb keyboard", "laptop"],
  },
  {
    id: "zenith-5g",
    name: "Zenith Fold 5G",
    category: "phones",
    price: 154999,
    rating: 4.6,
    reviews: 163,
    description:
      "A foldable flagship with adaptive 120Hz AMOLED display, pro-grade cameras, and all-day battery life.",
    image:
      "https://images.pexels.com/photos/6077127/pexels-photo-6077127.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Foldable AMOLED", "5G Ready", "Triple Pro Camera"],
    badge: "Just In",
    inStock: true,
    popularity: 91,
    releaseDate: "2024-08-22",
    tags: ["smartphone", "foldable", "android", "5g"],
  },
  {
    id: "pulse-buds-pro",
    name: "Pulse Buds Pro",
    category: "audio",
    price: 17999,
    rating: 4.7,
    reviews: 486,
    description:
      "Adaptive noise cancellation with studio-grade tuning and 42-hour battery in a pocketable case.",
    image:
      "https://images.pexels.com/photos/3394657/pexels-photo-3394657.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["42hr Battery", "Adaptive ANC", "Wireless Charging"],
    badge: "Top Rated",
    inStock: true,
    popularity: 88,
    releaseDate: "2023-11-05",
    tags: ["earbuds", "wireless", "bluetooth", "audio"],
  },
  {
    id: "lumos-watch",
    name: "Lumos S4 Smartwatch",
    category: "wearables",
    price: 26999,
    rating: 4.5,
    reviews: 302,
    description:
      "Track wellness with advanced biometrics, AMOLED display, and 10-day battery with fast charge.",
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["ECG Monitor", "AMOLED Always-On", "10-Day Battery"],
    badge: "Editor’s Pick",
    inStock: true,
    popularity: 82,
    releaseDate: "2024-01-18",
    tags: ["fitness", "smartwatch", "wearable", "health"],
  },
  {
    id: "atlas-dock",
    name: "Atlas Pro Thunderbolt Dock",
    category: "accessories",
    price: 21999,
    rating: 4.4,
    reviews: 128,
    description:
      "Expand your workstation with dual 4K displays, 2.5Gb ethernet, and 100W passthrough charging.",
    image:
      "https://images.pexels.com/photos/4792716/pexels-photo-4792716.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Dual 4K", "2.5Gb LAN", "100W PD"],
    badge: undefined,
    inStock: false,
    popularity: 74,
    releaseDate: "2023-06-30",
    tags: ["dock", "thunderbolt", "usb-c", "accessory"],
  },
  {
    id: "radiant-32",
    name: "Radiant 32\" Mini-LED Monitor",
    category: "monitors",
    price: 82999,
    rating: 4.9,
    reviews: 94,
    description:
      "Mini-LED panel with 99% DCI P3 coverage, hardware calibration, and 165Hz refresh for hybrid work.",
    image:
      "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Mini-LED", "165Hz", "USB-C Hub"],
    badge: "Creator Series",
    inStock: true,
    popularity: 96,
    releaseDate: "2024-05-08",
    tags: ["monitor", "mini-led", "creative", "display"],
  },
  {
    id: "aura-mech",
    name: "Aura Mech Wireless Keyboard",
    category: "accessories",
    price: 11999,
    rating: 4.3,
    reviews: 527,
    description:
      "Hot-swappable wireless mechanical keyboard with triple connection modes and south-facing RGB.",
    image:
      "https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Hot-Swap", "Tri-Mode", "PBT Keycaps"],
    badge: "Community Favorite",
    inStock: true,
    popularity: 85,
    releaseDate: "2022-09-14",
    tags: ["keyboard", "mechanical", "wireless", "rgb"],
  },
  {
    id: "voyager-sound",
    name: "Voyager Soundbar Max",
    category: "audio",
    price: 45999,
    rating: 4.6,
    reviews: 176,
    description:
      "Immersive 7.1.2 surround with spatial audio, wireless subwoofer, and Dolby Atmos support.",
    image:
      "https://images.pexels.com/photos/7164303/pexels-photo-7164303.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Dolby Atmos", "Wireless Sub", "HDMI eARC"],
    badge: undefined,
    inStock: true,
    popularity: 78,
    releaseDate: "2023-12-09",
    tags: ["soundbar", "home theatre", "audio", "dolby"],
  },
  {
    id: "nebula-tab",
    name: "Nebula Tab X",
    category: "tablets",
    price: 74999,
    rating: 4.4,
    reviews: 143,
    description:
      "Slim productivity tablet with nano-texture display, magnetic keyboard, and Snapdragon X Elite.",
    image:
      "https://images.pexels.com/photos/5082554/pexels-photo-5082554.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: ["Nano Display", "Snapdragon X", "Stylus Included"],
    badge: "Bundle Offer",
    inStock: true,
    popularity: 80,
    releaseDate: "2024-02-27",
    tags: ["tablet", "android", "stylus", "productivity"],
  },
];

const categoryFilters: Array<{ label: string; value: "all" | ProductCategory }> = [
  { label: "All products", value: "all" },
  { label: "Laptops", value: "laptops" },
  { label: "Smartphones", value: "phones" },
  { label: "Audio", value: "audio" },
  { label: "Wearables", value: "wearables" },
  { label: "Accessories", value: "accessories" },
  { label: "Monitors", value: "monitors" },
  { label: "Tablets", value: "tablets" },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest first", value: "newest" },
  { label: "Customer rating", value: "rating" },
];

type SortValue = (typeof sortOptions)[number]["value"];

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const highlights = [
  {
    icon: Sparkles,
    title: "Curated catalog",
    description: "Handpicked tech that complements your everyday workflow.",
  },
  {
    icon: ShoppingBag,
    title: "Flexible payment",
    description: "No-cost EMI, instant bank discounts, and reward paybacks.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted warranty",
    description: "Genuine brands with doorstep support across 2,500+ pincodes.",
  },
];

export default function ProductsPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const rawSearch = extractParam(searchParams.search) ?? "";
  const activeCategory = normalizeCategory(extractParam(searchParams.category));
  const activeSort = normalizeSort(extractParam(searchParams.sort));

  const normalizedSearch = rawSearch.trim().toLowerCase();

  const filteredProducts = productCatalog.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    if (!matchesCategory) return false;

    if (!normalizedSearch) return true;

    const haystack = [
      product.name,
      product.description,
      product.category,
      product.badge ?? "",
      ...product.highlights,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (activeSort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return b.popularity - a.popularity;
    }
  });

  const createHref = (
    updates: Partial<{ category: ProductCategory | "all"; sort: SortValue }>
  ) => {
    const params = new URLSearchParams();

    if (normalizedSearch) params.set("search", rawSearch.trim());

    const categoryValue =
      updates.category !== undefined ? updates.category : activeCategory;
    if (categoryValue && categoryValue !== "all") {
      params.set("category", categoryValue);
    }

    const sortValue =
      updates.sort !== undefined ? updates.sort : activeSort;
    if (sortValue && sortValue !== "featured") {
      params.set("sort", sortValue);
    }

    const queryString = params.toString();
    return queryString ? `/products?${queryString}` : "/products";
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-100 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              curated by eCom
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
              Discover tech that elevates your every day.
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Browse a modern mix of flagship devices, creator tools, and
              accessories chosen to match the clean aesthetic you love across
              the store.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="#catalog">Shop the collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/cart">View your cart</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="catalog" className="py-16">
        <Container className="space-y-10">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                  browse
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {sortedProducts.length} product
                  {sortedProducts.length !== 1 && "s"} curated for you
                </h2>
                {normalizedSearch && (
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Showing results for
                    <span className="ml-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
                      “{rawSearch.trim()}”
                    </span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((filter) => {
                    const isActive = activeCategory === filter.value;
                    const href = createHref({ category: filter.value });

                    return (
                      <Link
                        key={filter.value}
                        href={href}
                        className={[
                          "rounded-full border px-4 py-2 text-sm transition hover:-translate-y-[2px]",
                          isActive
                            ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700",
                        ].join(" ")}
                      >
                        {filter.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                    sort by
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => {
                      const isActive = activeSort === option.value;
                      const href = createHref({ sort: option.value });
                      return (
                        <Link
                          key={option.value}
                          href={href}
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                            isActive
                              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700",
                          ].join(" ")}
                        >
                          {option.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-10 py-20 text-center dark:border-neutral-700 dark:bg-neutral-900/60">
              <div className="flex size-16 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Star className="size-7" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Nothing matched your filters
              </h3>
              <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search keywords or explore the complete
                catalog—we are continuously adding fresh drops.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild>
                  <Link href="/products">Reset filters</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/cart">Review cart</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <article
                  key={product.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {product.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur dark:bg-neutral-100/90 dark:text-neutral-900">
                        {product.badge}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-4 rounded-full border-neutral-200 bg-white/90 text-neutral-600 backdrop-blur transition hover:text-red-500 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300"
                    >
                      <Heart className="size-4" />
                    </Button>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                          {product.category}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {product.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.highlights.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                        <Star className="size-4 text-amber-500" />
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      <span
                        className={[
                          "text-xs font-semibold uppercase tracking-[0.2em]",
                          product.inStock
                            ? "text-emerald-500"
                            : "text-red-500",
                        ].join(" ")}
                      >
                        {product.inStock ? "In stock" : "Restocking"}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="flex-1">Add to cart</Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/products/${product.id}`}>
                          View details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function extractParam(
  param: string | string[] | undefined
): string | undefined {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

const categoryValues = new Set(
  categoryFilters
    .map((filter) => filter.value)
    .filter((value) => value !== "all")
) as Set<ProductCategory>;

const sortValues = new Set(sortOptions.map((option) => option.value));

function normalizeCategory(
  value: string | undefined
): ProductCategory | "all" {
  if (!value || value === "all") return "all";
  return categoryValues.has(value as ProductCategory)
    ? (value as ProductCategory)
    : "all";
}

function normalizeSort(value: string | undefined): SortValue {
  if (!value || !sortValues.has(value)) return "featured";
  return value as SortValue;
}
