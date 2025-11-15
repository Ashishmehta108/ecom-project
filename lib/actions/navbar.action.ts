"use server"
import { auth } from "@/auth";
import { authClient } from "../auth-client";
import { getUserSession } from "@/server";

export const checkUser = async () => {
  try {
    const user = await getUserSession();
    return user?.user.role;
  } catch (error) {}
};
