import ImageSlider from "@/components/ImageSlider";
import ProductDealsSection from "@/components/products/ProductDealsSection";
import TopCategoriesSection from "@/components/products/TopCategoriesSection";
import ElectronicsBrandSlider from "@/components/products/ElectronicsBrandSlider";
import { getAllCategories } from "@/lib/actions/categories.actions";

// Sale banner slides...
const saleBanners = [
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=1080&fit=crop&q=90",
    badge: "🔥 FLASH SALE",
    discount: "70%",
    title: "Mega Electronics Sale",
    subtitle:
      "Get up to 70% off on smartphones, laptops, and gadgets. Limited time offer!",
    buttonText: "Shop Now",
    buttonLink: "/products?category=electronics",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&q=90",
    badge: "⚡ LIMITED TIME",
    discount: "50%",
    title: "Fashion & Lifestyle",
    subtitle:
      "Trending fashion at unbeatable prices. Free shipping on orders above ₹999!",
    buttonText: "Explore Fashion",
    buttonLink: "/products?category=fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=90",
    badge: "🎉 NEW ARRIVALS",
    discount: "40%",
    title: "Home & Kitchen Essentials",
    subtitle:
      "Transform your home with premium quality products. Best prices guaranteed!",
    buttonText: "Shop Home",
    buttonLink: "/products?category=home",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1920&h=1080&fit=crop&q=90",
    badge: "💎 PREMIUM DEALS",
    discount: "60%",
    title: "Beauty & Personal Care",
    subtitle:
      "Pamper yourself with top brands. Buy 2 Get 1 Free on selected items!",
    buttonText: "Shop Beauty",
    buttonLink: "/products?category=beauty",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop&q=90",
    badge: "🚀 BEST DEALS",
    discount: "55%",
    title: "Sports & Fitness",
    subtitle:
      "Stay active with premium sports gear. Extra 10% off for first-time buyers!",
    buttonText: "Shop Sports",
    buttonLink: "/products?category=sports",
  },
];

export default async function App() {
  const categories = await getAllCategories();
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* 🎥 Full-width slider */}
        <ImageSlider
          slides={saleBanners}
          // autoPlayInterval={5000}
          // showControls={true}
          // showProgress={true}
        />
        <TopCategoriesSection categories={categories} />
        <ProductDealsSection />
        <ElectronicsBrandSlider />
      </div>
    </div>
  );
}
