// "use client";

// export default function TechbarCTA() {
//   return (
//     <section className="w-full bg-gray-800 text-white py-20 md:py-28 px-4 md:px-10 relative overflow-hidden rounded-t-[40px] mt-20">

//       {/* Glow Background */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute left-[-120px] top-[-120px] w-[350px] h-[350px] bg-indigo-300/20 blur-[140px] rounded-full"></div>
//         <div className="absolute right-[-120px] bottom-[-120px] w-[350px] h-[350px] bg-indigo-400/20 blur-[140px] rounded-full"></div>
//       </div>

//       {/* Center Content */}
//       <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center justify-center px-4">

//         {/* Heading — tracking loose */}
//         <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-wide">
//           Ready to transform your shopping experience?
//         </h2>

//         {/* Subtext */}
//         <p className="text-base md:text-lg mt-6 opacity-90 max-w-[600px] mx-auto">
//           Join thousands of smart shoppers who discover premium tech products
//           with fast delivery, secure payments, and AI-powered recommendations.
//         </p>

//         {/* CTA Button */}
//         <div className="mt-10">
//           <button className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 hover:scale-[1.02] transition shadow-lg shadow-black/10">
//             Start Shopping Now
//             <span>→</span>
//           </button>
//         </div>

//         {/* Line */}
//         <div className="w-24 h-[1px] bg-white/25 mt-6"></div>

//         {/* Bottom Text */}
//         <p className="mt-3 text-xs md:text-sm opacity-80">
//           No account needed • Fast checkout • Trusted by 10,000+ buyers
//         </p>
//       </div>
//     </section>
//   );
// }

"use client";

import { ArrowRight } from "lucide-react";

export default function TechbarCTA() {
  return (
    <section className="w-[95%] mx-auto bg-gray-800 text-white py-20 md:py-28 px-4 md:px-10 relative overflow-hidden rounded-[40px] mt-20 mb-10">
      {/* Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-120px] top-[-120px] w-[350px] h-[350px] bg-indigo-300/20 blur-[140px] rounded-full"></div>
        <div className="absolute right-[-120px] bottom-[-120px] w-[350px] h-[350px] bg-indigo-400/20 blur-[140px] rounded-full"></div>
      </div>

      {/* Center Content */}
      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center justify-center px-4">
        {/* Heading — tracking loose */}
        <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-wide">
          Ready to transform your shopping experience?
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg mt-6 opacity-90 max-w-[600px] mx-auto">
          Join thousands of smart shoppers who discover premium tech products
          with fast delivery, secure payments, and AI-powered recommendations.
        </p>
        <button className="flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-2xl font-semibold mt-4 hover:bg-white/90 hover:scale-[1.02] transition shadow-lg shadow-black/10">
          Start Shopping Now
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Line */}
        <div className="w-24 h-[1px] bg-white/25 mt-6"></div>

        {/* Bottom Text */}
        <p className="mt-3 text-xs md:text-sm opacity-80">
          No account needed • Fast checkout • Trusted by 10,000+ buyers
        </p>
      </div>
    </section>
  );
}
