'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              Welcome to Vivah Verse (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">2. Information We Collect</h2>
            <p className="text-muted leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Name, email address, phone number, and other contact information</li>
              <li>Wedding date, guest count, and venue preferences</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Communications with our support team and vendors</li>
              <li>Account credentials and profile information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process bookings and payments</li>
              <li>Send you notifications about your bookings and account</li>
              <li>Provide personalized venue recommendations using our AI concierge</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">4. Information Sharing</h2>
            <p className="text-muted leading-relaxed">
              We share your information with venue partners to facilitate bookings, with payment processors 
              to handle transactions, and with service providers who assist in our operations. We do not 
              sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">5. Data Security</h2>
            <p className="text-muted leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. This includes 
              encryption, secure servers, and regular security assessments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">6. Your Rights</h2>
            <p className="text-muted leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">7. Cookies</h2>
            <p className="text-muted leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              You can control cookie preferences through your browser settings. For more details, please 
              refer to our Cookie Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-muted leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly 
              collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">9. Changes to This Policy</h2>
            <p className="text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">10. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-cream rounded-lg">
              <p className="text-charcoal font-medium">Vivah Verse Privacy Team</p>
              <p className="text-muted">Email: privacy@vivahverse.com</p>
              <p className="text-muted">Address: WeWork BKC, Level 5, Bandra Kurla Complex, Mumbai 400051</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
