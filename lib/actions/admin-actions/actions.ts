import { auth } from "@/auth";
import { headers } from "next/headers";

export async function listUsers() {
  const users = await auth.api.listUsers({
    query: {
      limit: 100,
      offset: 0,
      sortBy: "name",
      sortDirection: "desc",
    },
    headers: await headers(),
  });
  return users;
}
