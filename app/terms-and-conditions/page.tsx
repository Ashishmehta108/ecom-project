

"use client";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-black tracking-tight">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: November 18, 2025</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12 leading-relaxed">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-12">

          {/* Intro */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Introduction</h2>
            <p>Welcome to TechBar.store. These Terms & Conditions explain the rules for using our website, mobile app, and services.</p>
            <p>By accessing TechBar, you agree to follow these terms.</p>
            <p className="font-semibold">If you do not agree, you must stop using TechBar Services.</p>
          </section>

          {/* Eligibility */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Eligibility</h2>
            <p>You must be at least 18 years old to use or purchase from TechBar. Users under 18 require supervision from a parent or legal guardian.</p>
          </section>

          {/* Account */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Account Registration</h2>
            <p>Some features require you to create an account. You must provide correct information and keep your login details secure. You are responsible for all activity under your account.</p>
          </section>

          {/* Usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Use of TechBar Services</h2>
            <p>By using TechBar, you agree not to misuse our website or engage in fraudulent or illegal activities. Attempts to copy our content or access restricted data are strictly prohibited.</p>
            <p>Violation may lead to suspension or permanent account termination.</p>
          </section>

          {/* Products */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Product Descriptions</h2>
            <p>We aim for accuracy, but product details such as colors or availability may vary. If a product listing contains an error, we may cancel your order.</p>
          </section>

          {/* Pricing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Pricing & Payments</h2>
            <p>All prices are in INR. We support UPI, cards, wallets, net banking, and Cash on Delivery (where available). Payments are processed securely by third-party gateways.</p>
          </section>

          {/* Orders */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Orders & Cancellations</h2>
            <p>Your order is confirmed only after receiving an official confirmation email or SMS. You may cancel before dispatch for a full refund. After dispatch, cancellation depends on our return policy.</p>
            <p>We may cancel orders due to stock issues, payment failures, pricing errors, or suspected fraud.</p>
          </section>

          {/* Shipping */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Shipping & Delivery</h2>
            <p>Delivery timelines may vary based on courier delays, weather conditions, or stock location. We inform you of delays whenever possible.</p>
          </section>

          {/* Returns */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Returns, Refunds & Replacements</h2>
            <p>Return and replacement eligibility depends on the product category. Some items (like hygiene or perishable items) may not be returnable.</p>
            <p>Refunds are processed only after a successful quality check of the returned item.</p>
          </section>

          {/* IP */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Intellectual Property</h2>
            <p>All logos, images, text, and design elements belong to TechBar or its partners. Reuse is not allowed without permission.</p>
          </section>

          {/* Third-Party */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Third-Party Services</h2>
            <p>We may link to third-party services. We are not responsible for their content, privacy policies, or actions. Use them at your own risk.</p>
          </section>

          {/* Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Limitation of Liability</h2>
            <p>We are not liable for indirect losses, courier delays, incorrect user information, or unauthorized access caused by weak passwords.</p>
          </section>

          {/* Indemnification */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Indemnification</h2>
            <p>You agree to protect TechBar from any claims or damages arising from misuse of our Services or violation of these terms.</p>
          </section>

          {/* Updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of TechBar means you accept the updated terms.</p>
          </section>

          {/* Law */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Governing Law</h2>
            <p>These Terms are governed by Indian law. Legal matters will be handled in the courts of your state or city.</p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Contact Information</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-2">
              <p><span className="font-semibold">Email:</span> support@techbar.store</p>
              <p><span className="font-semibold">Phone:</span> [Your Number]</p>
              <p><span className="font-semibold">Address:</span> [Your Business Address]</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
