import SignUpForm from "@/components/SignupForm";
import { Suspense } from "react";

export default async function Signup() {
  // const session = await getUserSession();
  // console.log(session)
  // if (session == null) {
  //   redirect("/");
  // }
  return (
    <div className="w-full">
      <SignUpForm />
    </div>

  );
}
