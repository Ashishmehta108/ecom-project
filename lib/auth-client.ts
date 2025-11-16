import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient()],
});
