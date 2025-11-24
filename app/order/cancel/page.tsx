// "use client";

// import Link from "next/link";

// export default function CancelPage() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
//       <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl p-8 text-center">
        
//         {/* Icon wrapper */}
//         <div className="mx-auto w-28 h-28 flex items-center justify-center rounded-full bg-neutral-100">
//           <svg
//             width="72"
//             height="72"
//             viewBox="0 0 64 64"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-hidden="true"
//             role="img"
//           >
//             <title>Payment cancelled</title>
//             <g stroke="#C04B4B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
//               <path
//                 className="line line1"
//                 d="M20 20 L44 44"
//                 stroke="#C04B4B"
//                 fill="none"
//               />
//               <path
//                 className="line line2"
//                 d="M44 20 L20 44"
//                 stroke="#C04B4B"
//                 fill="none"
//               />
//             </g>
//           </svg>
//         </div>

//         <h1 className="mt-6 text-2xl font-semibold text-neutral-800">Payment cancelled</h1>

//         <p className="mt-2 text-sm text-neutral-500">
//           Your payment process was cancelled. No charges were made. Come back anytime and try again.
//         </p>

//         <div className="mt-6 flex items-center justify-center gap-3">
//           <Link
//             href="/"
//             className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white"
//           >
//             Return to store
//           </Link>

//           <Link
//             href="/checkout"
//             className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white"
//           >
//             Try again
//           </Link>
//         </div>
//       </div>

//       {/* Infinite Animation */}
//       <style>{`
//         .line {
//           stroke-dasharray: 40;
//           stroke-dashoffset: 40;
//           opacity: 0.95;
//         }

//         .line1 {
//           animation: draw 2s cubic-bezier(.2,.9,.3,1) infinite;
//         }

//         .line2 {
//           animation: draw 1s cubic-bezier(.2,.9,.3,1) infinite 2s;
//         }

//         @keyframes draw {
//           0%   { stroke-dashoffset: 40; }
//           50%  { stroke-dashoffset: 0; }
//           100% { stroke-dashoffset: 40; }
//         }
//       `}</style>
//     </main>
//   );
// }




"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl p-8 text-center">
        
        {/* Icon wrapper */}
        <div className="mx-auto w-28 h-28 flex items-center justify-center rounded-full bg-neutral-100">
          
          <motion.svg
            width="72"
            height="72"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.path
              d="M20 20 L44 44"
              stroke="#C04B4B"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            <motion.path
              d="M44 20 L20 44"
              stroke="#C04B4B"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.2,
              }}
            />
          </motion.svg>

        </div>

        <h1 className="mt-6 text-2xl font-semibold text-neutral-800">
          Payment cancelled
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Your payment was cancelled before completion. No money was charged.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white"
          >
            Return to store
          </Link>

          <Link
            href="/checkout"
            className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white"
          >
            Try again
          </Link>
        </div>
      </div>
    </main>
  );
}
