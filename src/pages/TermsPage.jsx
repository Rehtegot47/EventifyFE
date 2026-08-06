import MainLayout from "../layouts/MainLayout";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms &amp; Conditions</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Eventify, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to update it as needed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Ticket Purchases</h2>
          <p>
            All ticket sales are final unless the event is cancelled. Refunds for cancelled events will be processed within 14 business days. Resale of tickets is not permitted without authorization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Events</h2>
          <p>
            Event organizers are responsible for the accuracy of event details and fulfillment. Eventify is not liable for event cancellations, changes, or disputes between organizers and attendees.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Prohibited Conduct</h2>
          <p>
            You agree not to use Eventify for any unlawful purpose, to impersonate others, to distribute malware, or to engage in any activity that disrupts the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Limitation of Liability</h2>
          <p>
            Eventify is provided &quot;as is&quot; without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. Contact</h2>
          <p>
            For questions about these terms, please contact us at <a href="mailto:emmanuelezekwu63@gmail.com" className="text-eventify-600 dark:text-eventify-400 hover:underline">emmanuelezekwu63@gmail.com</a>.
          </p>
        </section>

        <p className="text-sm text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
          Last updated: January 2025
        </p>
      </div>
    </div>
  );
}
