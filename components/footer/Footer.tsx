

// "use client";

// import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="w-full bg-black text-neutral-300 relative overflow-hidden pt-16 pb-12">

//       {/* Glow accents */}
//       <div className="absolute left-[-80px] top-[-80px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl" />
//       <div className="absolute right-[-100px] bottom-[-120px] w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl" />

//       <div className="relative z-10 max-w-7xl mx-auto px-6">

//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

//           {/* BRAND */}
//           <div>
//             <h2 className="text-3xl font-semibold mb-4 tracking-wide text-white">
//               TechBar
//             </h2>

//             <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-xs">
//               Premium products. Fast delivery. Honest prices.  
//               Your everyday shopping partner.
//             </p>

//             <div className="space-y-4 text-sm">
//               <div>
//                 <p className="text-neutral-500 text-xs">WhatsApp</p>
//                 <p className="font-medium text-white">+1 202-918-2132</p>
//               </div>
//               <div>
//                 <p className="text-neutral-500 text-xs">Call Us</p>
//                 <p className="font-medium text-white">+1 202-918-2132</p>
//               </div>
//             </div>

//             {/* SOCIAL ICONS */}
//             <div className="flex gap-4 mt-6">
//               {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
//                 <Icon
//                   key={i}
//                   className="h-5 w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition duration-200"
//                 />
//               ))}
//             </div>
//           </div>

//           {/* POPULAR CATEGORIES */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-3">
//               Popular Categories
//             </h3>
//             <div className="h-[2px] w-[120px] bg-white/10 mb-5"></div>

//             <ul className="space-y-2 text-neutral-400 text-sm">
//               <li className="hover:text-white transition">• Staples</li>
//               <li className="hover:text-white transition">• Beverages</li>
//               <li className="hover:text-white transition">• Personal Care</li>
//               <li className="hover:text-white transition">• Home Care</li>
//               <li className="hover:text-white transition">• Baby Care</li>
//               <li className="hover:text-white transition">• Fruits & Vegetables</li>
//               <li className="hover:text-white transition">• Snacks</li>
//               <li className="hover:text-white transition">• Dairy & Bakery</li>
//             </ul>
//           </div>

//           {/* CUSTOMER SERVICES */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-3">
//               Customer Services
//             </h3>
//             <div className="h-[2px] w-[140px] bg-white/10 mb-5"></div>

//             <ul className="space-y-2 text-neutral-400 text-sm">
//               <li className="hover:text-white transition">• About Us</li>
//               <li className="hover:text-white transition">• Terms & Conditions</li>
//               <li className="hover:text-white transition">• FAQs</li>
//               <li className="hover:text-white transition">• Privacy Policy</li>
//               <li className="hover:text-white transition">• E-Waste Policy</li>
//               <li className="hover:text-white transition">• Cancellation & Returns</li>
//             </ul>
//           </div>

//         </div>

//         {/* COPYRIGHT */}
//         <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-neutral-500">
//           © {new Date().getFullYear()} TechBar. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-neutral-300 relative overflow-hidden pt-20 pb-10">

      {/* Soft Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-120px] top-[-120px] w-[320px] h-[320px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 place-items-center text-center lg:text-left">

          {/* BRAND */}
          <div className="max-w-xs">
            <h2 className="text-3xl font-semibold tracking-wide text-white mb-4">
              TechBar
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Your trusted online marketplace for premium brands, fast delivery, and amazing deals.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500 text-xs">WhatsApp</p>
                <p className="text-white font-medium">+1 202-918-2132</p>
              </div>
              <div>
                <p className="text-neutral-500 text-xs">Call Us</p>
                <p className="text-white font-medium">+1 202-918-2132</p>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex gap-5 mt-7 justify-center lg:justify-start">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Icon
                  key={i}
                  className="h-5 w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition duration-200"
                />
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              {[
                "Staples",
                "Beverages",
                "Personal Care",
                "Home Care",
                "Baby Care",
                "Fruits & Vegetables",
                "Snacks",
                "Dairy & Bakery",
              ].map((item, idx) => (
                <li key={idx} className="hover:text-white transition">• {item}</li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Customer Services
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              {[
                "About Us",
                "Terms & Conditions",
                "FAQs",
                "Privacy Policy",
                "E-Waste Policy",
                "Cancellation & Returns",
              ].map((item, idx) => (
                <li key={idx} className="hover:text-white transition">• {item}</li>
              ))}
            </ul>
          </div>

          {/* SUPPORT COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Support & Help
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              {[
                "Track Your Order",
                "Shipping Info",
                "Return Support",
                "Payments",
                "Report an Issue",
              ].map((item, idx) => (
                <li key={idx} className="hover:text-white transition">• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* LINE SEPARATOR */}
        <div className="mt-16 mb-6 h-[1px] w-full bg-white/10"></div>

        {/* COPYRIGHT */}
        <div className="text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} TechBar — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
