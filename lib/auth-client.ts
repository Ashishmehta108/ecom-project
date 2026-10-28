import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// NEXT_PUBLIC_* is inlined at build time; fall back to the current origin so a
// missing env var does not produce "undefined/api/auth" and hang the session.
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient()],
});
