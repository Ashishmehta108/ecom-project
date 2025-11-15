import SignUpForm from "@/components/SignupForm";
import { getUserSession } from "@/server";
import { Apple } from "iconsax-reactjs";
import { redirect } from "next/navigation";

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
