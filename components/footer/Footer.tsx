"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import tiktok from "@/public/tiktok-circle.svg";
import whatsapp from "@/public/whatsapp.svg";
import { useLanguage } from "@/app/context/languageContext";

export default function Footer() {
  const { locale } = useLanguage(); // 🌍 NEW

  // Categories (EN + PT translation)
  const categories = [
    {
      id: "mOTdRnd4ve0dp-1qcmUGB",
      name: locale === "pt" ? "Auriculares" : "Earphones",
    },
    {
      id: "yKuRPnbT-1iVANXJd0o22",
      name: locale === "pt" ? "Tablets" : "Tablet",
    },
    {
      id: "Zg-M3CrHIORqVsDa4vk18",
      name: locale === "pt" ? "Relógios" : "Watches",
    },
    {
      id: "q0yW2LXO_hsjUUV4iJawt",
      name: locale === "pt" ? "Colunas" : "Speakers",
    },
    {
      id: "INALZ1POuP-Wpgw1V5zxN",
      name: locale === "pt" ? "Telemóveis" : "Phones",
    },
    {
      id: "T_C_0IxGAA3Y4NgS0FgrC",
      name:
        locale === "pt" ? "Telemóveis Recondicionados" : "Refurbished Phones",
    },
  ];

  const getCategoryHref = (cat: any) =>
    `/products?category=${encodeURIComponent(cat.id)}`;

  return (
    <footer className="w-full bg-black text-neutral-300 relative overflow-hidden py-16">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-120px] top-[-120px] w-[280px] h-[280px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16 lg:gap-20">
          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2">TechBar</h2>

            <p className="text-white font-semibold tracking-wide text-sm mb-1">
              {locale === "pt"
                ? "Reparação rápida de telemóveis"
                : "Quick phone repair service"}
            </p>
            <p className="text-white font-bold tracking-[2px] text-sm mb-4">
              {locale === "pt" ? "TELECOMUNICAÇÕES" : "TELECOMMUNICATIONS"}
            </p>

            {/* ADDRESS */}
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Rua Ary dos Santos 20E <br />
              2810-433 Almada, Portugal
            </p>

            {/* CALL */}
            <div className="space-y-2 text-sm">
              <p className="text-neutral-500 text-xs mb-1">
                {locale === "pt" ? "Contacte-nos" : "Call Us"}
              </p>
              <p className="text-white font-medium tracking-wide">
                +351 910 554 006
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-6 mt-6">
              <a
                href="https://www.instagram.com/tech_bar786?igsh=NzBsYmFqaWY4ZDB0&utm_source=qr"
                target="_blank"
                className="opacity-70 hover:opacity-100 hover:scale-110 transition"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=351910554006"
                target="_blank"
                className="opacity-70 hover:opacity-100 hover:scale-110 transition"
              >
                <img src={whatsapp.src} alt="WhatsApp" className="h-5 w-5" />
              </a>

              <a
                href="https://www.tiktok.com/@tech_bar0786?_r=1&_t=ZG-91fNefzdQ7E"
                target="_blank"
                className="opacity-70 hover:opacity-100 hover:scale-110 transition invert"
              >
                <img src={tiktok.src} alt="TikTok" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {locale === "pt" ? "Categorias" : "Popular Categories"}
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              {categories.map((cat, idx) => (
                <li key={idx} className="hover:text-white transition">
                  • <Link href={getCategoryHref(cat)}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CUSTOMER SERVICES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {locale === "pt" ? "Serviço ao Cliente" : "Customer Services"}
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              <li className="hover:text-white transition">
                •{" "}
                <Link href="/about">
                  {locale === "pt" ? "Sobre Nós" : "About Us"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="/terms-and-conditions">
                  {locale === "pt"
                    ? "Termos e Condições"
                    : "Terms & Conditions"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="/privacy-policy">
                  {locale === "pt"
                    ? "Política de Privacidade"
                    : "Privacy Policy"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="/refund-policy">
                  {locale === "pt" ? "Política de Reembolso" : "Refund Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {locale === "pt" ? "Apoio ao Cliente" : "Support & Help"}
            </h3>
            <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
              <li className="hover:text-white transition">
                •{" "}
                <Link href="#">
                  {locale === "pt" ? "Rastrear Encomenda" : "Track Your Order"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="#">
                  {locale === "pt" ? "Informações de Envio" : "Shipping Info"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="#">
                  {locale === "pt" ? "Apoio a Devoluções" : "Return Support"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="#">
                  {locale === "pt" ? "Pagamentos" : "Payments"}
                </Link>
              </li>
              <li className="hover:text-white transition">
                •{" "}
                <Link href="#">
                  {locale === "pt" ? "Reportar Problema" : "Report an Issue"}
                </Link>
              </li>
            </ul>
          </div>

          {/* MAP */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {locale === "pt" ? "Localização" : "Our Location"}
            </h3>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2961.4627400739087!2d-9.164551674263032!3d38.65759232177618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSTREET%20-%20Rua%20Ary%20Dos%20Santos%2020e%20POSTAL%20CODE%202810-433%20Localidade%20Almada!5e1!3m2!1sen!2sin!4v1764350565302!5m2!1sen!2sin"
                width="100%"
                height="220"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 h-px w-full bg-white/10" />

        {/* COPYRIGHT */}
        <p className="text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} TechBar —{" "}
          {locale === "pt"
            ? "Todos os direitos reservados."
            : "All Rights Reserved."}
        </p>
      </div>
    </footer>
  );
}
