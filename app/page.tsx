import ImageSlider from "@/components/ImageSlider";
import ProductDealsSection from "@/components/products/ProductDealsSection";
import TopCategoriesSection from "@/components/products/TopCategoriesSection";
import ElectronicsBrandSlider from "@/components/products/ElectronicsBrandSlider";
import { getAllCategories } from "@/lib/actions/categories.actions";

import TopEarbudsSectionServer from "@/components/home/TopEarbudsSectionServer";



export default async function App() {
  const categories = await getAllCategories();
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <ImageSlider/>
        <TopCategoriesSection categories={categories} />
        <TopEarbudsSectionServer/>
        <ProductDealsSection />
       {/* <TopEarbudsSection/>
        */}
        
        {/* <ElectronicsBrandSlider /> */}
      </div>  
    </div>
  );
}
