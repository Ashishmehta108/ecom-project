import ImageSlider from "@/components/ImageSlider";
import ProductDealsSection from "@/components/products/ProductDealsSection";
import TopCategoriesSection from "@/components/products/TopCategoriesSection";
import { getAllCategories } from "@/lib/actions/categories.actions";
import TechbarCTA from "@/components/CTA/TechbarCTA";
import TopEarbudsSectionServer from "@/components/home/TopEarbudsSectionServer";
import TopSmartphonesSection from "@/components/home/TopSmartphoneServer";
import KlarnaBanner from "@/components/topbanner";

export default async function App() {
  const categories = await getAllCategories();
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <KlarnaBanner/>
        <ImageSlider />
        <TopCategoriesSection categories={categories} />
        <TopEarbudsSectionServer />
        {/* <TopSmartphonesSection /> */}
        <TechbarCTA />
      </div>
    </div>
  );
}
