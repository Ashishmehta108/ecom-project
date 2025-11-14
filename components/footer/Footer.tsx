"use client";

import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#0A4CA3] to-[#0672D8] text-white relative overflow-hidden pt-12 pb-10">

      {/* Glow Background Effect */}
      <div className="absolute left-[-150px] top-[-80px] w-[360px] h-[360px] rounded-full bg-[#1C6BE5] opacity-20 blur-3xl" />
      <div className="absolute right-[-100px] top-[40px] w-[300px] h-[300px] rounded-full bg-[#3A8FFF] opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND & CONTACT */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-wide">
              MegaMart
            </h2>

            <p className="text-blue-100/90 text-sm leading-relaxed max-w-xs mb-5">
              Your daily marketplace for premium products, fast delivery, and unbeatable deals.
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-blue-100/80 text-xs">WhatsApp</p>
                <p className="font-semibold text-sm">+1 202-918-2132</p>
              </div>

              <div>
                <p className="text-blue-100/80 text-xs">Call Us</p>
                <p className="font-semibold text-sm">+1 202-918-2132</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Icon
                  key={i}
                  className="h-5 w-5 cursor-pointer opacity-80 hover:opacity-100 transition"
                />
              ))}
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Popular Categories</h3>
            <div className="h-[2px] w-[120px] bg-blue-200/40 mb-5"></div>

            <ul className="space-y-2 text-blue-100/90 text-sm">
              <li className="hover:text-white transition">• Staples</li>
              <li className="hover:text-white transition">• Beverages</li>
              <li className="hover:text-white transition">• Personal Care</li>
              <li className="hover:text-white transition">• Home Care</li>
              <li className="hover:text-white transition">• Baby Care</li>
              <li className="hover:text-white transition">• Fruits & Vegetables</li>
              <li className="hover:text-white transition">• Snacks</li>
              <li className="hover:text-white transition">• Dairy & Bakery</li>
            </ul>
          </div>

          {/* CUSTOMER SERVICES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Customer Services</h3>
            <div className="h-[2px] w-[140px] bg-blue-200/40 mb-5"></div>

            <ul className="space-y-2 text-blue-100/90 text-sm">
              <li className="hover:text-white transition">• About Us</li>
              <li className="hover:text-white transition">• Terms & Conditions</li>
              <li className="hover:text-white transition">• FAQs</li>
              <li className="hover:text-white transition">• Privacy Policy</li>
              <li className="hover:text-white transition">• E-Waste Policy</li>
              <li className="hover:text-white transition">• Cancellation & Returns</li>
            </ul>
          </div>

          {/* APP & PAYMENT METHODS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Get Our App</h3>
            <div className="h-[2px] w-[110px] bg-blue-200/40 mb-5"></div>

            {/* Store Badges */}
            <div className="flex gap-3 mb-6">
              <Image
                src="/appstore.png"
                alt="App Store"
                width={130}
                height={44}
                className="cursor-pointer hover:opacity-80 transition"
              />
              <Image
                src="/googleplay.png"
                alt="Google Play"
                width={130}
                height={44}
                className="cursor-pointer hover:opacity-80 transition"
              />
            </div>

            {/* Payment Icons */}
            <h3 className="text-lg font-semibold text-white mb-3">We Accept</h3>
            <div className="h-[2px] w-[100px] bg-blue-200/40 mb-4"></div>

            <div className="flex gap-4 items-center">
              <Image src="/visa.png" alt="Visa" width={45} height={25} />
              <Image src="/mastercard.png" alt="Mastercard" width={45} height={25} />
              <Image src="/rupay.png" alt="Rupay" width={45} height={25} />
              <Image src="/upi.png" alt="UPI" width={45} height={25} />
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 pt-6 border-t border-blue-200/30 text-center text-xs text-blue-100/70">
          © {new Date().getFullYear()} aaaaaaaaaaaa.
        </div>

      </div>
    </footer>
  );
}
