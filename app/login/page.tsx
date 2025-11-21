import LoginForm from "@/components/LoginForm";
// import { isAuthenticated } from "@/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
export default async function Login() {
  // if (isAuthenticated) {
  //   redirect("/");
  // }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

//tpyvOVIzJrVsNa40GS31FJLaifOBlTVk
