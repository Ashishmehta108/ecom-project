import SignUpForm from "@/components/SignupForm";
import { getUserSession } from "@/server";
import { Apple } from "iconsax-reactjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Signup() {
  // const session = await getUserSession();
  // console.log(session)
  // if (session == null) {
  //   redirect("/");
  // }
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="w-full">
      <SignUpForm />
    </div>

    </Suspense>
  );
}
