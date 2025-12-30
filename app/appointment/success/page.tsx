"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/languageContext";

// 🌎 Success Page Translations
const t = {
  en: {
    title: "Appointment Confirmed!",
    message:
      "Thank you for scheduling with us. You’ll receive a confirmation email shortly.",
    btn: "Return Home",
  },
  pt: {
    title: "Consulta Confirmada!",
    message:
      "Obrigado por agendar conosco. Você receberá um e-mail de confirmação em breve.",
    btn: "Voltar ao Início",
  },
};

export default function AppointmentSuccessPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const text = t[locale];

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl">
          <CardContent className="py-10 px-6 text-center space-y-6">
            
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 drop-shadow-md" />
            </motion.div>

            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {text.title}
            </h1>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              {text.message}
            </p>

            <Button
              className="w-full rounded-xl font-medium h-12"
              onClick={() => router.push("/")}
            >
              {text.btn}
            </Button>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
