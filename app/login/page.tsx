import LoginForm from "@/components/LoginForm";
import { getUserSession } from "@/server";
import { redirect } from "next/navigation";
export default async function Login() {
  const user = await getUserSession();
  if (user?.session.id) {
    redirect("/");
  }
  // if (isAuthenticated) {
  //   redirect("/");
  // }
  return <LoginForm />;
}
