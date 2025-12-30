import { getTopSmartphones } from "@/lib/actions/get-smartphone";
import TopSmartphonesSectionClient from "./TopsmartphoneClient";

export default async function TopSmartphonesSection() {
  const smartphones = await getTopSmartphones();
console.log("these are smartphones", smartphones)
  // Pass multilingual product names - client will resolve based on current language
  return <TopSmartphonesSectionClient smartphones={smartphones} />;
}
