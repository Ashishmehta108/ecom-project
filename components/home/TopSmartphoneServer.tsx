import { getTopSmartphones } from "@/lib/actions/get-smartphone";
import TopSmartphonesSectionClient from "./TopsmartphoneClient";

export default async function TopSmartphonesSection() {
  const smartphones = await getTopSmartphones();

  return <TopSmartphonesSectionClient smartphones={smartphones} />;
}
