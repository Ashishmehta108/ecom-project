// "use client";

// export default function AboutPage() {
//   return (
//     <section className="w-full bg-white text-black py-20">
//       <div className="max-w-5xl mx-auto px-6">
//         {/* Heading */}
//         <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
//           About <span className="text-blue-600">TechBar</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//           Your go-to store for everything tech — simple, fast, and reliable.
//         </p>

//         {/* Content */}
//         <div className="space-y-10 text-lg leading-relaxed text-gray-700">
//           <p>
//             At <strong>TechBar</strong>, we believe buying gadgets shouldn’t
//             feel like solving a puzzle. No fake promises, no confusing specs, no
//             shady sellers — just straight-up, genuine tech products you can rely
//             on. We started TechBar with a simple mission:{" "}
//             <strong>
//               make premium tech accessible and trustworthy for everyone
//             </strong>
//             . From smartwatches and earbuds to gaming accessories and smart home
//             products — everything we list is checked for quality, durability,
//             and real-world performance. The world moves fast, and so does
//             technology. We stay ahead by bringing you the latest products, the
//             cleanest UI experience, and a shopping journey that just *feels
//             right*. Whether you're upgrading your setup or gifting someone,
//             TechBar has your back. Our team is a mix of tech geeks, designers,
//             and testers who love two things:
//             <strong>great gadgets</strong> and{" "}
//             <strong>great experiences</strong>. We test what we sell —
//             seriously. If it’s not good enough for us, it’s not good enough for
//             you. Thanks for being part of the TechBar family.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

export default function AboutPage() {
  return (
    <section className="w-full bg-white text-black py-16">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          About <span className="text-blue-600">TechBar</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          Your trusted destination for quality tech, transparent service, and a smooth shopping experience.
        </p>

        {/* Main Content */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
          <p>
            At <strong>TechBar</strong>, our philosophy is simple: technology should be easy, reliable,
            and accessible to everyone. No unnecessary complications, no confusing tech jargon,
            and definitely no low-quality products pretending to be something they’re not.
            We built TechBar because the online tech market desperately needed something real.
            People were tired of scams, fake specs, and disappointing purchases — and honestly,
            so were we. That’s why everything you see here is carefully selected, checked,
            reviewed, and tested to match real-world expectations, not just marketing hype.
            Whether it’s smartwatches, earbuds, gaming gear, chargers, speakers, or lifestyle tech,
            our goal is to bring you products that actually deliver. If we wouldn’t use it ourselves,
            we won’t sell it. It’s that simple.
          </p>

          {/* New Section: What Makes Us Different */}
          <h2 className="text-xl font-semibold mt-6">What Makes Us Different</h2>
          <ul className="list-disc pl-3 space-y-1">
            <li>Products that are verified for quality and durability.</li>
            <li>Clean and modern shopping experience with smooth UI.</li>
            <li>Fast customer support that talks like humans, not bots.</li>
            <li>Transparent details — no fake specs, no misleading claims.</li>
            <li>Constant updates with new, trending tech products.</li>
          </ul>

          {/* New Section: Our Mission */}
          <h2 className="text-xl font-semibold mt-6">Our Mission</h2>
          <p>
            We want to simplify how people buy tech online. Our mission is to make premium-quality
            gadgets accessible to everyone — without stress, confusion, or doubt. Technology keeps
            moving forward, and we want you to move with it confidently.
          </p>

          {/* New Section: Our Team */}
          <h2 className="text-xl font-semibold mt-6">Our Team</h2>
          <p>
            TechBar is powered by a small but passionate team of tech enthusiasts, designers, testers,
            and problem-solvers. We spend hours comparing products, testing features, breaking things,
            fixing them, and finding what truly works. We’re obsessed with great tech and even better
            user experiences.
          </p>

          {/* Closing */}
          <p className="mt-4">
            Thank you for being a part of our journey. Whether you're upgrading your setup, buying a gift,
            or exploring new tech, <strong>TechBar has your back.</strong> Always.
          </p>
        </div>
      </div>
    </section>
  );
}
