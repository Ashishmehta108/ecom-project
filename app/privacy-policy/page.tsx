"use client";
import { useLanguage } from "@/app/context/languageContext";
export default function PrivacyPolicy() {
  const { locale } = useLanguage(); // NEW

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {locale === "pt" ? "Política de Privacidade" : "Privacy Policy"}
          </h1>
          <p className="mt-3 text-sm text-gray-500 tracking-wide">
            {locale === "pt"
              ? "Última Atualização: 18 de Novembro de 2025"
              : "Last Updated: November 18, 2025"}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 space-y-12">
          {/* INTRO */}
          <section className="space-y-4">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {locale === "pt"
                ? "Na TechBar, respeitamos a sua privacidade e tratamos os seus dados pessoais com responsabilidade e transparência. Esta Política de Privacidade explica como recolhemos e processamos os seus dados ao utilizar os nossos serviços."
                : "At TechBar, we respect your privacy and handle your personal data with responsibility and transparency. This Privacy Policy explains how we collect and process your information when you use our services."}
            </p>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {locale === "pt"
                ? "Ao utilizar os serviços TechBar, está a consentir a recolha, utilização e processamento da sua informação conforme descrito nesta Política."
                : "By using TechBar Services, you consent to the collection, use, and processing of your information as described in this Policy."}
            </p>
          </section>

          {/* SECTION 1 */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              {locale === "pt"
                ? "Que Dados Pessoais Recolhemos?"
                : "What Personal Information Does TechBar Collect?"}
            </h2>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {locale === "pt"
                ? "Recolhemos dados necessários para operar e melhorar os nossos serviços."
                : "We collect information needed to operate and improve our services."}
            </p>

            <div className="space-y-6">
              {/* Provided Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                  {locale === "pt"
                    ? "Informação que fornece voluntariamente"
                    : "Information You Provide"}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {locale === "pt"
                    ? "Inclui dados pessoais partilhados diretamente durante o uso dos serviços TechBar:"
                    : "Includes personal details shared directly while using TechBar Services:"}
                </p>
                <ul className="space-y-1 ml-6 text-gray-700 text-sm md:text-base leading-relaxed">
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Nome, email, número de telefone"
                      : "Name, email, phone number"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Endereço de entrega/faturação"
                      : "Shipping/billing address"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt" ? "Credenciais de login" : "Login details"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Documentos enviados (se necessário para verificação de identidade)"
                      : "Uploaded documents (for identity verification if required)"}
                  </li>
                </ul>
              </div>

              {/* Automatic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                  {locale === "pt"
                    ? "Informação recolhida automaticamente"
                    : "Automatic Information"}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {locale === "pt"
                    ? "Recolhida automaticamente ao aceder aos nossos serviços:"
                    : "Automatically collected while accessing our services:"}
                </p>
                <ul className="space-y-1 ml-6 text-gray-700 text-sm md:text-base leading-relaxed">
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Dispositivo e navegador"
                      : "Device and browser details"}
                  </li>
                  <li>• {locale === "pt" ? "Endereço IP" : "IP address"}</li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Cookies e identificadores"
                      : "Cookies & unique identifiers"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Dados de navegação"
                      : "Clickstream data"}
                  </li>
                </ul>
              </div>

              {/* External Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                  {locale === "pt"
                    ? "Informação proveniente de terceiros"
                    : "Information from External Sources"}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {locale === "pt"
                    ? "Podemos receber dados de parceiros e serviços associados:"
                    : "We may receive data from trusted partners:"}
                </p>
                <ul className="space-y-1 ml-6 text-gray-700 text-sm md:text-base leading-relaxed">
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Transportadoras (dados de entrega atualizados)"
                      : "Courier partners (updated delivery details)"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Gateways de pagamento"
                      : "Payment gateways"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Serviços de análise"
                      : "Analytics services"}
                  </li>
                  <li>
                    •{" "}
                    {locale === "pt"
                      ? "Parceiros e afiliados"
                      : "Affiliates & service partners"}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              {locale === "pt"
                ? "Como Utilizamos os Seus Dados?"
                : "How TechBar Uses Your Personal Information"}
            </h2>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {locale === "pt"
                ? "Utilizamos os dados para fornecer, melhorar e proteger os serviços TechBar."
                : "We use your data to operate, enhance, and secure TechBar Services."}
            </p>

            <div className="space-y-4">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {" "}
                {locale === "pt"
                  ? "Processar encomendas e entregas"
                  : "Order processing & delivery"}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {" "}
                {locale === "pt"
                  ? "Melhorar funcionalidades e desempenho"
                  : "Feature functionality & improvement"}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {" "}
                {locale === "pt"
                  ? "Personalizar recomendações"
                  : "Personalized recommendations"}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {" "}
                {locale === "pt"
                  ? "Comunicações e suporte ao cliente"
                  : "Customer communication & support"}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {locale === "pt" ? "Cumprimento legal" : "Legal compliance"}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {" "}
                {locale === "pt"
                  ? "Prevenção de fraude e segurança"
                  : "Fraud prevention & security"}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
