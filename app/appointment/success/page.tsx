"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppointmentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur">
          <CardContent className="py-10 px-6 text-center space-y-5">
            
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </motion.div>

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Appointment Confirmed
            </h1>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              Thank you for scheduling with us.  
              You’ll receive a confirmation email shortly with all the details.
            </p>

            <div className="pt-4">
              <Button
                className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600"
                onClick={() => window.location.href = "/"}
              >
                Go Back Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
