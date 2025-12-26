"use client";

import { useLanguage } from "@/app/context/languageContext";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function TechbarCTA() {
  const { locale } = useLanguage();

  return (
    <section
      className="relative w-[95%] mx-auto overflow-hidden rounded-[40px] mt-20 mb-10
      bg-gradient-to-br from-[#f8f8f9] via-[#f3f3f4] to-[#e9e9eb]
      border border-neutral-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)]
      "
    >
      {/* Soft neutral glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-[-150px] top-[-100px] w-[420px] h-[420px]
          bg-neutral-200/50 blur-[180px] rounded-full"
        />
        <div
          className="absolute right-[-150px] bottom-[-100px] w-[420px] h-[420px]
          bg-neutral-300/40 blur-[180px] rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto text-center px-6 py-24 md:py-28">
        <h2
          className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.15]
          text-neutral-900"
        >
          {locale === "pt"
            ? "Agende seu atendimento em nossa loja hoje."
            : "Book your service appointment at our store today."}
        </h2>

        <p className="text-base text-neutral-600 md:text-lg mt-6 max-w-xl mx-auto">
          {locale === "pt"
            ? "Rápido, confiável e feito por profissionais."
            : "Fast, reliable and handled by professionals."}
        </p>

        {/* Button */}
        <button
          className="group relative mt-8 px-8 py-4 rounded-2xl font-semibold
          bg-neutral-900 text-neutral-100 cursor-pointer shadow-lg shadow-neutral-300/20
          hover:shadow-xl hover:shadow-neutral-400/30 hover:bg-neutral-800
          transition-all duration-300"
          onClick={() => redirect("/appointment")}
        >
          <span className="flex items-center gap-2">
            {locale === "pt" ? "Agendar serviço" : "Book your service"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>

          {/* subtle glossy highlight */}
          <span
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0
            group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          />
        </button>

        {/* Divider */}
        <div className="w-20 h-px bg-neutral-300 mx-auto mt-10" />

        <p className="mt-4 text-xs md:text-sm text-neutral-500 tracking-wide">
          {locale === "pt"
            ? "Sem cadastro • Pagamento rápido • Entrega em 24 horas"
            : "No signup needed • Lightning-fast checkout • 24 hours delivery"}
        </p>
      </div>
    </section>
  );
}
