"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto w-28 h-28 flex items-center justify-center rounded-full bg-neutral-100"
        >
          <svg
            width="74"
            height="74"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Infinite Line Draw Animation */}
            <motion.path
              d="M20 20 L44 44"
              stroke="#C04B4B"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.path
              d="M44 20 L20 44"
              stroke="#C04B4B"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </svg>
        </motion.div>

        <h1 className="mt-6 text-2xl font-semibold text-neutral-800">
          Payment Cancelled
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Your payment was cancelled. No charges were made. You can try again
          anytime.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white hover:bg-neutral-100 transition"
          >
            Return to store
          </Link>

          <Link
            href="/checkout"
            className="inline-block px-5 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white hover:bg-neutral-100 transition"
          >
            Try again
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
