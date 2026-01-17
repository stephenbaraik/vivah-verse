'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">
          Terms of Service
        </h1>
        <p className="text-muted mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              By accessing and using Vivah Verse (&quot;Platform&quot;), you accept and agree to be bound by these 
              Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not 
              use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">2. Description of Service</h2>
            <p className="text-muted leading-relaxed">
              Vivah Verse is an online platform that connects couples planning weddings with venue partners. 
              We provide venue discovery, booking facilitation, and AI-powered concierge services. We act 
              as an intermediary and do not directly provide venue or catering services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">3. User Accounts</h2>
            <p className="text-muted leading-relaxed mb-4">To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">4. Bookings and Payments</h2>
            <p className="text-muted leading-relaxed mb-4">When making a booking through our platform:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>You agree to the venue&apos;s specific terms and conditions</li>
              <li>Payment is required to confirm bookings as per the venue&apos;s payment schedule</li>
              <li>Prices shown are indicative and may vary based on final requirements</li>
              <li>Platform fees are non-refundable unless specified otherwise</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">5. Cancellation Policy</h2>
            <p className="text-muted leading-relaxed">
              Cancellation and refund terms are determined by individual venues. Generally:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4 mt-4">
              <li>Cancellations 60+ days before event: 75% refund of venue charges</li>
              <li>Cancellations 30-59 days before event: 50% refund of venue charges</li>
              <li>Cancellations 15-29 days before event: 25% refund of venue charges</li>
              <li>Cancellations less than 15 days: No refund</li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              Platform fees are generally non-refundable. Please check specific venue policies before booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">6. User Conduct</h2>
            <p className="text-muted leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Use the platform for any unlawful purpose</li>
              <li>Provide false or misleading information</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Attempt to bypass any security measures</li>
              <li>Scrape or collect data from the platform without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">7. Venue Partner Obligations</h2>
            <p className="text-muted leading-relaxed">
              Venue partners listing on our platform agree to provide accurate information, honor confirmed 
              bookings, maintain quality standards, and resolve disputes in good faith. Vivah Verse reserves 
              the right to remove listings that violate our policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">8. Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              All content on the platform, including text, graphics, logos, and software, is the property 
              of Vivah Verse or our licensors. You may not reproduce, distribute, or create derivative 
              works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">9. Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              Vivah Verse acts as an intermediary platform. We are not liable for the quality, safety, 
              or legality of venues or services provided by venue partners. Our liability is limited to 
              the amount of platform fees paid by you for the relevant booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">10. Dispute Resolution</h2>
            <p className="text-muted leading-relaxed">
              Any disputes arising from your use of the platform shall be resolved through arbitration 
              in Mumbai, India, in accordance with the Arbitration and Conciliation Act, 1996. The 
              language of arbitration shall be English.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">11. Changes to Terms</h2>
            <p className="text-muted leading-relaxed">
              We may modify these Terms of Service at any time. Continued use of the platform after 
              changes constitutes acceptance of the new terms. We will notify users of significant 
              changes via email or platform notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">12. Contact Information</h2>
            <p className="text-muted leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-cream rounded-lg">
              <p className="text-charcoal font-medium">Vivah Verse Legal Team</p>
              <p className="text-muted">Email: legal@vivahverse.com</p>
              <p className="text-muted">Address: WeWork BKC, Level 5, Bandra Kurla Complex, Mumbai 400051</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
