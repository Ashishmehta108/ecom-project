import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const baseURL=process.env.NEXT_PUBLIC_APP_URL
export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient()],
});
