"use client";
import { useLanguage } from "@/app/context/languageContext";
export default function AboutPage() {
  const { locale } = useLanguage(); // ⬅ NEW

  return (
    <section className="w-full bg-white text-black py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {locale === "pt" ? (
            <>
              Sobre <span className="text-indigo-600">TechBar</span>
            </>
          ) : (
            <>
              About <span className="text-indigo-600">TechBar</span>
            </>
          )}
        </h1>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          {locale === "pt"
            ? "Seu destino de confiança para tecnologia de qualidade, serviço transparente e uma experiência de compra tranquila."
            : "Your trusted destination for quality tech, transparent service, and a smooth shopping experience."}
        </p>

        {/* Main Content */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
          <p>
            {locale === "pt" ? (
              <>
                Na <strong>TechBar</strong>, nossa filosofia é simples:
                tecnologia deve ser fácil, confiável e acessível para todos. Sem
                complicações desnecessárias, sem jargão confuso, e
                definitivamente sem produtos de baixa qualidade fingindo ser
                algo que não são. Construímos a TechBar porque o mercado online
                de tecnologia precisava urgentemente de algo real. As pessoas
                estavam cansadas de golpes, especificações falsas e compras
                decepcionantes — e nós também. Por isso, tudo o que você vê aqui
                é cuidadosamente selecionado, verificado e testado para atender
                às expectativas reais, não apenas ao marketing. Se nós não
                usaríamos, nós não vendemos. Simples assim.
              </>
            ) : (
              <>
                At <strong>TechBar</strong>, our philosophy is simple:
                technology should be easy, reliable, and accessible to everyone.
                No unnecessary complications, no confusing tech jargon, and
                definitely no low-quality products pretending to be something
                they’re not. We built TechBar because the online tech market
                desperately needed something real. People were tired of scams,
                fake specs, and disappointing purchases — and honestly, so were
                we. That’s why everything you see here is carefully selected,
                checked, reviewed, and tested to match real-world expectations,
                not just marketing hype. If we wouldn’t use it ourselves, we
                won’t sell it. It’s that simple.
              </>
            )}
          </p>

          {/* What Makes Us Different */}
          <h2 className="text-xl font-semibold mt-6">
            {locale === "pt"
              ? "O que nos torna diferentes"
              : "What Makes Us Different"}
          </h2>
          <ul className="list-disc pl-3 space-y-1">
            {locale === "pt" ? (
              <>
                <li>Produtos verificados para qualidade e durabilidade.</li>
                <li>Experiência de compra moderna com interface fluida.</li>
                <li>Suporte rápido e humano — não robôs.</li>
                <li>Transparência total — sem especificações falsas.</li>
                <li>
                  Atualizações constantes com produtos tecnológicos novos e em
                  alta.
                </li>
              </>
            ) : (
              <>
                <li>Products that are verified for quality and durability.</li>
                <li>Clean and modern shopping experience with smooth UI.</li>
                <li>Fast customer support that talks like humans, not bots.</li>
                <li>
                  Transparent details — no fake specs, no misleading claims.
                </li>
                <li>Constant updates with new, trending tech products.</li>
              </>
            )}
          </ul>

          {/* Mission */}
          <h2 className="text-xl font-semibold mt-6">
            {locale === "pt" ? "Nossa Missão" : "Our Mission"}
          </h2>
          <p>
            {locale === "pt"
              ? "Queremos simplificar a forma como as pessoas compram tecnologia online. Tornar gadgets premium acessíveis para todos — sem estresse, dúvida ou confusão."
              : "We want to simplify how people buy tech online. Our mission is to make premium-quality gadgets accessible to everyone — without stress, confusion, or doubt."}
          </p>

          {/* Team */}
          <h2 className="text-xl font-semibold mt-6">
            {locale === "pt" ? "Nossa Equipe" : "Our Team"}
          </h2>
          <p>
            {locale === "pt"
              ? "A TechBar é movida por uma pequena equipe apaixonada por tecnologia. Passamos horas testando produtos, comparando funcionalidades e garantindo que tudo entregue o que promete."
              : "TechBar is powered by a small but passionate team of tech enthusiasts who spend hours comparing, testing, breaking, and improving products to ensure they truly deliver."}
          </p>

          {/* Closing */}
          <p className="mt-4">
            {locale === "pt"
              ? "Obrigado por fazer parte desta jornada. A TechBar está sempre ao seu lado!"
              : "Thank you for being a part of our journey. TechBar always has your back!"}
          </p>
        </div>
      </div>
    </section>
  );
}
