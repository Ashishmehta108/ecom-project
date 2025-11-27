"use client";

export default function AboutPage() {
  return (
    <section className="w-full bg-white text-black py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          About <span className="text-blue-600">TechBar</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Your go-to store for everything tech — simple, fast, and reliable.
        </p>

        {/* Content */}
        <div className="space-y-10 text-lg leading-relaxed text-gray-700">

          <p>
            At <strong>TechBar</strong>, we believe buying gadgets shouldn’t feel like solving a puzzle.
            No fake promises, no confusing specs, no shady sellers — just straight-up, genuine tech products you can rely on.
          </p>

          <p>
            We started TechBar with a simple mission: <strong>make premium tech accessible and trustworthy for everyone</strong>.
            From smartwatches and earbuds to gaming accessories and smart home products — everything we list is 
            checked for quality, durability, and real-world performance.
          </p>

          <p>
            The world moves fast, and so does technology. We stay ahead by bringing you the latest products,
            the cleanest UI experience, and a shopping journey that just *feels right*. 
            Whether you're upgrading your setup or gifting someone, TechBar has your back.
          </p>

          <p>
            Our team is a mix of tech geeks, designers, and testers who love two things:  
            <strong>great gadgets</strong> and <strong>great experiences</strong>.  
            We test what we sell — seriously. If it’s not good enough for us, it’s not good enough for you.
          </p>

          <p>
            Thanks for being part of the TechBar family.  
           
          </p>

        </div>
      </div>
    </section>
  );
}
