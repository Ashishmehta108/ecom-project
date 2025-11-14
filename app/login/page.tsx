import LoginForm from "@/components/LoginForm";
// import { isAuthenticated } from "@/server";
import { redirect } from "next/navigation";
export default async function Login() {
  // if (isAuthenticated) {
  //   redirect("/");
  // }
  return <LoginForm />;
}


//tpyvOVIzJrVsNa40GS31FJLaifOBlTVk