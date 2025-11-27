import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./lib/db";
import { schema } from "@/lib/db/schema";
import { admin } from "better-auth/plugins";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "./lib/loadEnv";
import { sendEmail } from "./lib/sendemail";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          html: `<div>Click the link to verify your email: ${url}</div>`,
        });
      } catch (err) {
        console.error("EMAIL ERROR:", err);
      }
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<div>Click the link to reset your password: ${url}</div>`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"],
    },
  },
  rateLimit: {
    window: 10,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  },
  plugins: [admin()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});
