import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Studio Mudiaga",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-playfair text-4xl text-white mb-2">Terms of Service</h1>
        <p className="text-white/30 text-sm mb-12">Last updated: June 2026</p>

        <div className="space-y-10 text-white/60 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using studiomudiaga.com, you agree to be bound by these Terms of
              Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Our Services</h2>
            <p>
              Studio Mudiaga provides an online platform for browsing and booking premium shortlet
              apartments and purchasing handcrafted furniture in Nigeria. We act as the direct
              provider for all listed properties and furniture items.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>You may not use another person&apos;s account without their permission.</li>
              <li>We reserve the right to suspend accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Shortlet Bookings</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Bookings are confirmed upon receipt of full or agreed deposit payment.</li>
              <li>Cancellation policies are communicated at the time of booking.</li>
              <li>Guests are responsible for any damage caused during their stay.</li>
              <li>Check-in and check-out times are specified per property listing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Furniture Orders</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All furniture orders are subject to availability.</li>
              <li>Delivery timelines are estimates and may vary.</li>
              <li>Returns and exchanges are handled on a case-by-case basis within 7 days of delivery.</li>
              <li>Custom or made-to-order items are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Payments</h2>
            <p>
              All prices are displayed in Nigerian Naira (₦). Payments are processed securely
              through our payment partners. Studio Mudiaga does not store card details.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Intellectual Property</h2>
            <p>
              All content on this platform — including images, text, logos, and designs — is the
              property of Studio Mudiaga and may not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Limitation of Liability</h2>
            <p>
              Studio Mudiaga is not liable for indirect, incidental, or consequential damages
              arising from the use of our platform or services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after
              changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:hello@studiomudiaga.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                hello@studiomudiaga.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
