// // app/checkout/page.tsx
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";
// import CheckoutClient from "@/components/checkout/page";

// export default async function CheckoutPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/sign-in");
//   }

//   // You can decide amount on the page or via query; here we hardcode:
//   const amount = 50000; // ₹50.00

//   return (
//     <div className="max-w-lg mx-auto py-10 px-4">
//       <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
//       <p className="mb-4 text-sm text-muted-foreground">
//         You are about to pay ₹{amount / 100}.
//       </p>
//       <CheckoutClient amount={amount} />
//     </div>
//   );
// }
// app/checkout/page.tsx



import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutClient from "@/components/checkout/page";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const amount = 500; // ₹500.00 → because 50000 paise

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        You are about to pay ₹{amount / 100}.
      </p>

      <CheckoutClient amount={amount} />
    </div>
  );
}
