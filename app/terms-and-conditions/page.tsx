"use client";

import { useLanguage } from "../context/languageContext";

export default function TermsAndConditions() {
  const { locale } = useLanguage(); // NEW

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-black tracking-tight opacity-90">
            {locale === "pt" ? "Termos e Condições" : "Terms & Conditions"}
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 leading-relaxed">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-10 space-y-10">
          {/* INTRO */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Introdução" : "Introduction"}
            </h2>

            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Bem-vindo ao TechBar.store. Estes Termos e Condições explicam as regras para a utilização do nosso website, aplicação móvel e serviços."
                : "Welcome to TechBar.store. These Terms & Conditions explain the rules for using our website, mobile app, and services."}
            </p>

            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Ao aceder ao TechBar, concorda em seguir estes termos."
                : "By accessing TechBar, you agree to follow these terms."}
            </p>

            <p className="font-medium text-sm md:text-base">
              {locale === "pt"
                ? "Se não concordar, deve parar de utilizar os Serviços TechBar."
                : "If you do not agree, you must stop using TechBar Services."}
            </p>

            {/* Eligibility */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Elegibilidade" : "Eligibility"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Deve ter pelo menos 18 anos para utilizar ou comprar na TechBar. Utilizadores menores de 18 anos requerem supervisão de um pai ou tutor legal."
                : "You must be at least 18 years old to use or purchase from TechBar. Users under 18 require supervision from a parent or legal guardian."}
            </p>

            {/* Account Registration */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Registo de Conta" : "Account Registration"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Algumas funcionalidades exigem a criação de uma conta. Deve fornecer informações corretas e manter as suas credenciais seguras. É responsável por todas as atividades realizadas na sua conta."
                : "Some features require you to create an account. You must provide correct information and keep your login details secure. You are responsible for all activity under your account."}
            </p>

            {/* Use of Services */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Utilização dos Serviços TechBar"
                : "Use of TechBar Services"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Ao utilizar a TechBar, concorda em não utilizar indevidamente o website ou realizar atividades ilegais ou fraudulentas. Qualquer tentativa de copiar conteúdo ou aceder a dados restritos é estritamente proibida."
                : "By using TechBar, you agree not to misuse our website or engage in fraudulent or illegal activities. Attempts to copy our content or access restricted data are strictly prohibited."}
            </p>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "A violação destes termos pode resultar na suspensão ou encerramento permanente da conta."
                : "Violation may lead to suspension or permanent account termination."}
            </p>

            {/* Product Descriptions */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Descrições de Produtos"
                : "Product Descriptions"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Tentamos ser precisos, mas os detalhes dos produtos, como cor ou disponibilidade, podem variar. Se houver um erro na listagem de um produto, a encomenda pode ser cancelada."
                : "We aim for accuracy, but product details such as colors or availability may vary. If a product listing contains an error, we may cancel your order."}
            </p>

            {/* Pricing & Payments */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Preços e Pagamentos" : "Pricing & Payments"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Todos os preços estão em EURO. Aceitamos Visa, MasterCard, MB Way, MultiBanco, Klarna, cartões, e net banking (quando disponível). Os pagamentos são processados com segurança por gateways de pagamento Stripe."
                : "All prices are in EURO. We support Visa, MasterCard, MBway, MultiBanco, Klarna, cards, net banking (where available). Payments are processed securely by Stripe Payment gateways."}
            </p>

            {/* Orders & Cancellations */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Encomendas e Cancelamentos"
                : "Orders & Cancellations"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "A encomenda é confirmada apenas após o envio de um email ou SMS de confirmação. Pode cancelar antes do envio para obter reembolso total. Após o envio, aplicam-se as nossas regras de devolução."
                : "Your order is confirmed only after receiving an official confirmation email or SMS. You may cancel before dispatch for a full refund. After dispatch, cancellation depends on our return policy."}
            </p>

            {/* Shipping */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Envio e Entregas" : "Shipping & Delivery"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Os prazos de entrega podem variar devido a atrasos logísticos, condições meteorológicas ou localização do stock. Informaremos sempre que possível em caso de atraso."
                : "Delivery timelines may vary based on courier delays, weather conditions, or stock location. We inform you of delays whenever possible."}
            </p>

            {/* Returns */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Devoluções, Reembolsos e Substituições"
                : "Returns, Refunds & Replacements"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "As devoluções, reembolsos e substituições são aceites apenas em caso de produto defeituoso, danificado ou incorreto. O pedido deve ser realizado dentro de 7 dias após a entrega. O produto deve ser devolvido com embalagem original e acessórios. Caso não passe na inspeção, será devolvido ao cliente sem reembolso. A substituição depende de disponibilidade de stock."
                : "Returns, refunds, and replacements are accepted only in cases where the delivered product is defective, damaged, or incorrect. Customers must submit a return request within 7 days of delivery. Items must be returned in original packaging with all accessories. Replacement depends on stock availability and is limited to one replacement per order."}
            </p>

            {/* IP */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Propriedade Intelectual"
                : "Intellectual Property"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Todos os logotipos, imagens, textos e elementos de design pertencem à TechBar ou aos seus parceiros. A utilização não autorizada é proibida."
                : "All logos, images, text, and design elements belong to TechBar or its partners. Reuse is not allowed without permission."}
            </p>

            {/* Third-party */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Serviços de Terceiros"
                : "Third-Party Services"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Podemos incluir ligações a serviços de terceiros. Não somos responsáveis pelo conteúdo, políticas de privacidade ou ações desses serviços. A utilização é por sua conta e risco."
                : "We may link to third-party services. We are not responsible for their content, privacy policies, or actions. Use them at your own risk."}
            </p>

            {/* Liability */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt"
                ? "Limitação de Responsabilidade"
                : "Limitation of Liability"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Não somos responsáveis por perdas indiretas, atrasos de entregas, informações incorretas fornecidas pelo utilizador, ou acessos não autorizados causados por credenciais fracas."
                : "We are not liable for indirect losses, courier delays, incorrect user information, or unauthorized access caused by weak passwords."}
            </p>

            {/* Modifications */}
            <h2 className="text-xl font-semibold text-black opacity-90">
              {locale === "pt" ? "Alterações aos Termos" : "Changes to Terms"}
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              {locale === "pt"
                ? "Podemos atualizar estes Termos ocasionalmente. A continuação da utilização dos serviços TechBar significa que aceita os termos atualizados."
                : "We may update these Terms from time to time. Continued use of TechBar means you accept the updated terms."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
