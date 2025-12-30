"use client";

import { useLanguage } from "@/app/context/languageContext";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function TechbarCTA() {
  const { locale } = useLanguage();

  return (
    <section
      className="relative w-full max-w-[95%] mx-auto overflow-hidden rounded-3xl mt-14 mb-10
      bg-gradient-to-br from-[#fafafa] via-[#f3f3f4] to-[#e9e9eb]
      border border-neutral-200 shadow-[0_6px_28px_-10px_rgba(0,0,0,0.06)]
      md:rounded-[40px]"
    >
      {/* Soft Glows */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -left-24 -top-24 w-64 h-64 bg-neutral-300/40 blur-[150px] rounded-full" />
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-neutral-400/30 blur-[150px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto text-center px-6 py-14 sm:py-18 md:py-24">
        <h2
          className="font-semibold tracking-tight text-neutral-900 leading-tight
          text-2xl sm:text-3xl md:text-4xl"
        >
          {locale === "pt"
            ? "Agende seu atendimento em nossa loja hoje."
            : "Book your service appointment at our store today."}
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 mt-4 sm:mt-5 max-w-md mx-auto">
          {locale === "pt"
            ? "Rápido, confiável e feito por profissionais."
            : "Fast, reliable and handled by professionals."}
        </p>

        {/* Button */}
        <button
          onClick={() => redirect("/appointment")}
          className="
            group relative mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-4
            rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
            bg-neutral-900 text-neutral-100 shadow-md shadow-neutral-300/20
            hover:shadow-lg hover:shadow-neutral-400/30 hover:bg-neutral-800
            active:scale-[0.98] transition-all duration-300
          "
        >
          <span className="flex items-center gap-2 justify-center">
            {locale === "pt" ? "Agendar serviço" : "Book your service"}
            <ArrowRight className="size-4 sm:size-5 transition-transform group-hover:translate-x-1" />
          </span>

          <span className="absolute inset-0 rounded-xl bg-white/10 group-hover:opacity-30 transition-opacity pointer-events-none" />
        </button>

        {/* Divider */}
        <div className="w-16 h-px bg-neutral-300 mx-auto mt-8 sm:mt-10" />

        <p className="mt-3 text-xs sm:text-sm text-neutral-500 tracking-wide">
          {locale === "pt"
            ? "Sem cadastro • Pagamento rápido • Entrega em 24 horas"
            : "No signup needed • Fast checkout • 24-hour delivery"}
        </p>
      </div>
    </section>
  );
}
