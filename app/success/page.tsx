"use client";

import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setSessionData(data);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className=" bg-white dark:bg-neutral-950 flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-xl text-center"
      >
        {/* Animated Icon */}
        {/* <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto mb-6"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </motion.div> */}

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Payment Successful 🎉
        </h1>

        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Thank you for your purchase!
        </p>

        {/* Order Summary */}
        {!loading && sessionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 rounded-xl bg-neutral-100/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-left"
          >
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Amount Paid
                </span>
                <span className="font-medium">
                  {(sessionData.amount_total / 100).toFixed(2)}{" "}
                  {sessionData.currency.toUpperCase()}
                </span>
              </div>

              {sessionData.customer_email && (
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Receipt sent to
                  </span>
                  <span className="font-medium">{sessionData.customer_email}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-black dark:bg-white dark:text-black hover:opacity-90 transition"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
          >
            View Orders
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
