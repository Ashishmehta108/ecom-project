// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { z } from "zod";
// import { authClient } from "@/lib/auth-client";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";

// const schema = z.object({
//   newPassword: z.string().min(8, "Password must be at least 8 characters"),
// });

// export default function ResetPasswordPage() {
//   const params = useSearchParams();
//   const token = params.get("token");
//   const router = useRouter();

//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!token) return <div className="p-4">Invalid or missing token</div>;

//   const onSubmit = async () => {
//     const validate = schema.safeParse({ newPassword });
//     if (!validate.success) {
//       toast.error(validate.error.issues[0].message);
//       return;
//     }

//     try {
//       setLoading(true);

//       const { error } = await authClient.resetPassword({
//         newPassword,
//         token,
//       });

//       if (error) {
//         toast.error(error.message);
//       } else {
//         toast.success("Password updated! Please login.");
//         router.push("/login");
//       }
//     } catch (e) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-center">
//             Reset Password
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div>
//             <label className="text-sm font-medium mb-1 block">
//               New Password
//             </label>
//             <Input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>

//           <Button className="w-full" disabled={loading} onClick={onSubmit}>
//             {loading ? "Updating..." : "Update Password"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) return <div className="p-4 text-neutral-600">Invalid or missing token</div>;

  const onSubmit = async () => {
    const validate = schema.safeParse({ newPassword });
    if (!validate.success) {
      toast.error(validate.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.resetPassword({ newPassword, token });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated! Please login.");
        router.push("/login");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <Card className="w-full max-w-md border border-neutral-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-neutral-800">
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Button
            className="w-full bg-neutral-800 text-white border border-neutral-700 shadow-none hover:bg-neutral-800 hover:opacity-95 transition-none"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-neutral-600">
        Loading...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
