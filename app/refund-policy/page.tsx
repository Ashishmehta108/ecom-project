"use client";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-black tracking-tight">Refund Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: November 18, 2025</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12 leading-relaxed">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-12">

          {/* Intro */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Introduction</h2>
            <p>At TechBar, we want you to have a smooth and worry-free shopping experience. This Refund Policy explains how returns, replacements, and refunds work for purchases made through TechBar Services.</p>
            <p>By placing an order with us, you agree to the terms outlined below.</p>
          </section>

          {/* Eligibility */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Return & Refund Eligibility</h2>
            <p>Different product categories may have different return windows. A product may be eligible for return or replacement if:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>The item is damaged or defective</li>
              <li>You received the wrong product</li>
              <li>The product is eligible under the category-specific return window</li>
            </ul>
            <p>Items such as hygiene products, perishables, or used/opened items may not be eligible for return.</p>
          </section>

          {/* Process */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">How to Request a Return</h2>
            <p>To start a return request:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Go to your TechBar Order History</li>
              <li>Select the product you want to return</li>
              <li>Choose a reason and upload images if required</li>
            </ul>
            <p>Once the request is submitted, our team will review it and update you on the next steps.</p>
          </section>

          {/* Pickup */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Return Pickup & Quality Check</h2>
            <p>After your request is approved, a pickup will be scheduled. The product must be returned in its original condition, including:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Original packaging</li>
              <li>Accessories and manuals</li>
              <li>Invoice or proof of purchase</li>
            </ul>
            <p>A quality check will be performed once the item reaches our facility. Refunds and replacements will be processed only after the product passes the inspection.</p>
          </section>

          {/* Refunds */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Refund Timelines</h2>
            <p>If your return is approved, refunds will be initiated within 2–7 business days. Refund timelines may vary based on payment method:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>UPI: 1–3 days</li>
              <li>Debit/Credit Card: 3–7 days</li>
              <li>Wallets: Instant–24 hours</li>
              <li>Net Banking: 2–4 days</li>
              <li>Cash on Delivery: Refund issued to bank/wallet</li>
            </ul>
            <p>We will notify you via email/SMS once your refund has been processed.</p>
          </section>

          {/* Non-Returnable */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Non-Returnable Items</h2>
            <p>Some items cannot be returned for safety, hygiene, or product-type reasons. These include but are not limited to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Personal hygiene items</li>
              <li>Consumable goods</li>
              <li>Used or damaged items</li>
              <li>Products marked as “Non-returnable”</li>
            </ul>
          </section>

          {/* Cancellations */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Order Cancellations</h2>
            <p>You may cancel your order before it is dispatched to receive a full refund. Once dispatched, cancellation may not be possible, but you may still be eligible for a return depending on the product.</p>
            <p>TechBar reserves the right to cancel orders due to unavailability, payment issues, or suspected fraud.</p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-black">Contact Us</h2>
            <p>If you have questions regarding returns or refunds, contact our support team:</p>
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
