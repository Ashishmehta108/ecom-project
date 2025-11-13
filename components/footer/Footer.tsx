"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0582c1] text-white relative overflow-hidden pt-10 pb-8">

      {/* Background circle effect */}
      <div className="absolute right-[-150px] top-0 w-[400px] h-[400px] rounded-full bg-[#0a8ed4] opacity-30" />
      <div className="absolute right-[-80px] top-14 w-[280px] h-[280px] rounded-full bg-[#0b95dd] opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* LEFT SECTION — BRAND + CONTACT + DOWNLOAD */}
          <div>
            <h2 className="text-3xl font-bold mb-4">MegaMart</h2>

            <h3 className="font-semibold text-lg mb-2.5">Contact Us</h3>

            <div className="flex items-start gap-3 mb-3">
              <div>
                <p className="text-white/90 text-xs sm:text-sm">Whats App</p>
                <p className="font-medium text-sm sm:text-base">+1 202-918-2132</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
             
              <div>
                <p className="text-white/90 text-xs sm:text-sm">Call Us</p>
                <p className="font-medium text-sm sm:text-base">+1 202-918-2132</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2.5">Download App</h3>

            <div className="flex gap-3">
              <Image
                src="/appstore.png"
                alt="App Store"
                width={130}
                height={44}
                className="cursor-pointer"
              />
              <Image
                src="/googleplay.png"
                alt="Google Play"
                width={130}
                height={44}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* CENTER — POPULAR CATEGORIES */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Most Popular Categories</h3>
            <div className="h-[2px] w-[110px] bg-white mb-4"></div>

            <ul className="space-y-2 text-white/90 text-sm sm:text-base">
              <li>• Staples</li>
              <li>• Beverages</li>
              <li>• Personal Care</li>
              <li>• Home Care</li>
              <li>• Baby Care</li>
              <li>• Vegetables & Fruits</li>
              <li>• Snacks & Foods</li>
              <li>• Dairy & Bakery</li>
            </ul>
          </div>

          {/* RIGHT — CUSTOMER SERVICES */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Customer Services</h3>
            <div className="h-[2px] w-[130px] bg-white mb-4"></div>

            <ul className="space-y-2 text-white/90 text-sm sm:text-base">
              <li>• About Us</li>
              <li>• Terms & Conditions</li>
              <li>• FAQ</li>
              <li>• Privacy Policy</li>
              <li>• E-waste Policy</li>
              <li>• Cancellation & Return Policy</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-8 pt-4 border-t border-white/30 text-center text-xs sm:text-sm">
          © {new Date().getFullYear()} Pise de pehle 
        </div>
      </div>
    </footer>
  );
}
