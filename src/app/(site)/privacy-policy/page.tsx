import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Studio Mudiaga",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-playfair text-4xl text-white mb-2">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-12">Last updated: June 2026</p>

        <div className="space-y-10 text-white/60 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Who We Are</h2>
            <p>
              Studio Mudiaga is a curated lifestyle brand offering premium shortlet apartments and
              handcrafted furniture in Nigeria. Our platform is accessible at{" "}
              <span className="text-white/80">studiomudiaga.com</span>. When you use our services,
              you trust us with your information — this policy explains what we collect and how we
              use it.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="text-white/80">Account information:</span> name, email address, and password when you register.</li>
              <li><span className="text-white/80">Booking & order details:</span> dates, property or product selections, and transaction history.</li>
              <li><span className="text-white/80">Usage data:</span> pages visited, time spent, and general location (country/city level).</li>
              <li><span className="text-white/80">Communications:</span> messages you send us via email or contact forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To create and manage your account.</li>
              <li>To process bookings and furniture orders.</li>
              <li>To send booking confirmations and order updates by email.</li>
              <li>To improve our platform and personalise your experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Google Sign-In</h2>
            <p>
              You may choose to sign in using your Google account. When you do, we receive your
              name, email address, and profile picture from Google. We do not receive your Google
              password. Your use of Google Sign-In is also subject to Google&apos;s Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Data Sharing</h2>
            <p>
              We do not sell your personal data. We share information only with service providers
              necessary to operate our platform (hosting, payment processing, email delivery) and
              only to the extent required to deliver those services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. You may request
              deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete the personal data we hold about you.
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@studiomudiaga.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                hello@studiomudiaga.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Contact</h2>
            <p>
              Studio Mudiaga · Lagos, Nigeria ·{" "}
              <a href="mailto:hello@studiomudiaga.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                hello@studiomudiaga.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
