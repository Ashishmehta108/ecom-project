import { Suspense } from "react";
import EmailVerificationSent from "./client";



export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <EmailVerificationSent />
    </Suspense>
  );
}
