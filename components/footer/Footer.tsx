// "use client";

// import Link from "next/link";
// import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="w-full bg-black text-neutral-300 relative overflow-hidden py-16">
//       {/* Soft Glow */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute left-[-120px] top-[-120px] w-[280px] h-[280px] rounded-full bg-white/10 blur-3xl" />
//         <div className="absolute right-[-120px] bottom-[-120px] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
//           {/* BRAND */}
//           <div>
//             <h2 className="text-3xl font-semibold text-white mb-4">TechBar</h2>
//             <p className="text-neutral-400 text-sm leading-relaxed mb-6">
//               Your trusted online marketplace for premium brands, fast delivery,
//               and amazing deals.
//             </p>

//             <div className="space-y-3 text-sm">
//               <div>
//                 <p className="text-neutral-500 text-xs">WhatsApp</p>
//                 <p className="text-white font-medium">+351910554006</p>
//               </div>
//               <div>
//                 <p className="text-neutral-500 text-xs">Call Us</p>
//                 <p className="text-white font-medium">+351212593048</p>
//               </div>
//             </div>

//             {/* SOCIALS */}
//             <div className="flex gap-6 mt-6">
//               {[
//                 { Icon: Facebook, url: "https://facebook.com/yourpage" },
//                 {
//                   Icon: Instagram,
//                   url: "https://www.instagram.com/tech_bar786?igsh=NzBsYmFqaWY4ZDB0&utm_source=qr",
//                 },
//                 { Icon: Twitter, url: "https://twitter.com/yourpage" },
//                 { Icon: Youtube, url: "https://youtube.com/yourpage" },
//               ].map(({ Icon, url }, i) => (
//                 <a
//                   key={i}
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="opacity-70 hover:opacity-100 hover:scale-110 transition"
//                 >
//                   <Icon className="h-5 w-5" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Popular Categories */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Popular Categories
//             </h3>
//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               {[
//                 "Electronic",
//                 "Earphones",
//                 "Tablet",
//                 "Watches",
//                 "Speakers",
//                 "Phones",
//                 "Refurbished Phones",
//               ].map((item, idx) => (
//                 <li key={idx} className="hover:text-white transition">
//                   • {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer Services */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Customer Services
//             </h3>
//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               <li className="hover:text-white transition">
//                 • <Link href="/about">About Us</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/terms-and-conditions">Terms & Conditions</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/privacy-policy">Privacy Policy</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/refund-policy">Refund Policy</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Support & Help
//             </h3>

//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               <li className="hover:text-white transition">
//                 • Track Your Order
//               </li>
//               <li className="hover:text-white transition">• Shipping Info</li>
//               <li className="hover:text-white transition">• Return Support</li>
//               <li className="hover:text-white transition">• Payments</li>
//               <li className="hover:text-white transition">• Report an Issue</li>
//             </ul>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="mt-16 mb-8 h-px w-full bg-white/10" />

//         {/* Copyright */}
//         <p className="text-center text-xs text-neutral-500">
//           © {new Date().getFullYear()} TechBar — All Rights Reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }





// "use client";

// import Link from "next/link";
// import { Instagram, Twitter, Bot, MessageCircle } from "lucide-react";

// export default function Footer() {
//   // Category list: replace `id` with your real category IDs when available.
//   const categories = [
//     { name: "Electronic", id: "tct4X81gRVIz3zCVj3J90" }, // <- your provided ID
//     { name: "Earphones", id: "mOTdRnd4ve0dp-1qcmUGB" },
//     { name: "Tablet", id: "yKuRPnbT-1iVANXJd0o22" },
//     { name: "Watches", id: "Zg-M3CrHIORqVsDa4vk18" },
//     { name: "Speakers", id: "q0yW2LXO_hsjUUV4iJawt" },
//     { name: "Phones", id: "INALZ1POuP-Wpgw1V5zxN" },
//     { name: "Refurbished Phones", id: "T_C_0IxGAA3Y4NgS0FgrC"},
//   ];

//   const getCategoryHref = (cat) => {
//     // prefer explicit id if provided, otherwise use slug
//     const value = cat.id ? cat.id : encodeURIComponent(cat.slug);
//     return `/products?category=${value}`;
//   };

//   return (
//     <footer className="w-full bg-black text-neutral-300 relative overflow-hidden py-16">
//       {/* Soft Glow */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute left-[-120px] top-[-120px] w-[280px] h-[280px] rounded-full bg-white/10 blur-3xl" />
//         <div className="absolute right-[-120px] bottom-[-120px] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
//           {/* BRAND */}
// <div>
//   <h2 className="text-3xl font-semibold text-white mb-2">TechBar</h2>

//   {/* Custom Taglines */}
//   <p className="text-white font-semibold tracking-wide text-sm mb-1">
//     Reparação de telemóveis na hora
//   </p>
//   <p className="text-white font-bold tracking-[2px] text-sm mb-4">
//     TELECOMUNICAÇÕES
//   </p>

//   {/* Address */}
//   <p className="text-neutral-400 text-sm leading-relaxed mb-6">
//     STREET - Rua Ary Dos Santos 20e <br />
//     POSTAL CODE 2810-433 <br />
//     Localidade Almada
//   </p>

//   {/* WhatsApp */}
//   <div className="space-y-3 text-sm">
//     <div>
//       <p className="text-neutral-500 text-xs">WhatsApp</p>
//       <a
//         href="https://api.whatsapp.com/send?phone=351910554006"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-white font-medium flex items-center gap-2 hover:opacity-80 transition"
//       >
//         <MessageCircle className="h-4 w-4" />
//         +351910554006
//       </a>
//     </div>
//   </div>

//   {/* SOCIALS */}
//   <div className="flex gap-6 mt-6">
//     {[
//       {
//         Icon: Instagram,
//         url: "https://www.instagram.com/tech_bar786?igsh=NzBsYmFqaWY4ZDB0&utm_source=qr",
//       },
//       { Icon: Twitter, url: "https://twitter.com/yourpage" },
//       { Icon: Bot, url: "https://tiktok.com/@yourpage" },
//     ].map(({ Icon, url }, i) => (
//       <a
//         key={i}
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="opacity-70 hover:opacity-100 hover:scale-110 transition"
//       >
//         <Icon className="h-5 w-5" />
//       </a>
//     ))}
//   </div>
// </div>


//           {/* Popular Categories */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Popular Categories
//             </h3>
//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               {categories.map((cat, idx) => (
//                 <li key={idx} className="hover:text-white transition">
//                   •{" "}
//                   <Link href={getCategoryHref(cat)}>
//                     {cat.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer Services */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Customer Services
//             </h3>
//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               <li className="hover:text-white transition">
//                 • <Link href="/about">About Us</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/terms-and-conditions">Terms & Conditions</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/privacy-policy">Privacy Policy</Link>
//               </li>
//               <li className="hover:text-white transition">
//                 • <Link href="/refund-policy">Refund Policy</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Support & Help
//             </h3>

//             <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
//               {[
//                 "Track Your Order",
//                 "Shipping Info",
//                 "Return Support",
//                 "Payments",
//                 "Report an Issue",
//               ].map((item, idx) => (
//                 <li key={idx} className="hover:text-white transition">
//                   • <Link href="#">{item}</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="mt-16 mb-8 h-px w-full bg-white/10" />

//         {/* Copyright */}
//         <p className="text-center text-xs text-neutral-500">
//           © {new Date().getFullYear()} TechBar — All Rights Reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }



"use client";

import Link from "next/link";
import { Instagram, Twitter, Bot, MessageCircle } from "lucide-react";
import tiktok from "@/public/tiktok-circle.svg";
import whatsapp from "@/public/whatsapp.svg";

export default function Footer() {
  // Category list
  const categories = [
    { name: "Earphones", id: "mOTdRnd4ve0dp-1qcmUGB" },
    { name: "Tablet", id: "yKuRPnbT-1iVANXJd0o22" },
    { name: "Watches", id: "Zg-M3CrHIORqVsDa4vk18" },
    { name: "Speakers", id: "q0yW2LXO_hsjUUV4iJawt" },
    { name: "Phones", id: "INALZ1POuP-Wpgw1V5zxN" },
    { name: "Refurbished Phones", id: "T_C_0IxGAA3Y4NgS0FgrC" },
  ];

  const getCategoryHref = (cat) => {
    const value = cat.id ? cat.id : encodeURIComponent(cat.slug);
    return `/products?category=${value}`;
  };

  return (
    <footer className="w-full bg-black text-neutral-300 relative overflow-hidden py-16">
      {/* Soft Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-120px] top-[-120px] w-[280px] h-[280px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16 lg:gap-20">

          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2">TechBar</h2>

            <p className="text-white font-semibold tracking-wide text-sm mb-1">
              Reparação de telemóveis na hora
            </p>
            <p className="text-white font-bold tracking-[2px] text-sm mb-4">
              TELECOMUNICAÇÕES
            </p>

            {/* Address */}
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              STREET - Rua Ary Dos Santos 20e <br />
              POSTAL CODE 2810-433 <br />
              Localidade Almada
            </p>

{/* Call Us */}
<div className="space-y-2 text-sm">
  <div>
    <p className="text-neutral-500 text-xs mb-1">Call Us</p>

    <p className="text-white font-medium tracking-wide">
      +351 910 554 006
    </p>
  </div>
</div>


           {/* SOCIALS */}
<div className="flex gap-6 mt-6">
  <a
    href="https://www.instagram.com/tech_bar786?igsh=NzBsYmFqaWY4ZDB0&utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
    className="opacity-70 hover:opacity-100 hover:scale-110 transition"
  >
    <Instagram className="h-5 w-5" />
  </a>

  <a
    href="https://api.whatsapp.com/send?phone=351910554006"
    target="_blank"
    rel="noopener noreferrer"
    className="opacity-70 hover:opacity-100 hover:scale-110 transition"
  >
    <img src={whatsapp.src} alt="WhatsApp" className="h-5 w-5" />
  </a>

  {/* TikTok Custom SVG */}
  <a
    href="https://www.tiktok.com/@tech_bar0786?_r=1&_t=ZG-91fNefzdQ7E"
    target="_blank"
    rel="noopener noreferrer"
    className="opacity-70 hover:opacity-100 hover:scale-110 transition invert"
  >
    <img src={tiktok.src} alt="Tiktok" className="h-5 w-5" />
  </a>
</div>

          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              {categories.map((cat, idx) => (
                <li key={idx} className="hover:text-white transition">
                  • <Link href={getCategoryHref(cat)}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Services</h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              <li className="hover:text-white transition">
                • <Link href="/about">About Us</Link>
              </li>
              <li className="hover:text-white transition">
                • <Link href="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li className="hover:text-white transition">
                • <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="hover:text-white transition">
                • <Link href="/refund-policy">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support & Help</h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              {[
                "Track Your Order",
                "Shipping Info",
                "Return Support",
                "Payments",
                "Report an Issue",
              ].map((item, idx) => (
                <li key={idx} className="hover:text-white transition">
                  • <Link href="#">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MAP LOCATION */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Location</h3>

            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2961.4627400739087!2d-9.164551674263032!3d38.65759232177618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSTREET%20-%20Rua%20Ary%20Dos%20Santos%2020e%20POSTAL%20CODE%202810-433%20Localidade%20Almada!5e1!3m2!1sen!2sin!4v1764350565302!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 h-px w-full bg-white/10" />

        {/* Copyright */}
        <p className="text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} TechBar — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
