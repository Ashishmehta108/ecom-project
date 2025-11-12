import SignUpForm from "@/components/SignupForm";
import { isAuthenticated } from "@/server";
import { redirect } from "next/navigation";

export default async function Signup() {
  if (isAuthenticated) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <SignUpForm />
    </div>
  );
}
