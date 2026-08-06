export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect information you provide during registration (name, email, phone) and when you purchase tickets (payment details, event preferences). We also collect usage data such as page views and device information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            Your information is used to process transactions, send event updates, improve our services, and provide customer support. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Data Security</h2>
          <p>
            We implement industry-standard encryption and security measures to protect your data. However, no method of transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Cookies</h2>
          <p>
            We use cookies to enhance your experience, remember preferences, and analyze traffic. You can control cookie settings through your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Third-Party Services</h2>
          <p>
            We may share data with payment processors and analytics providers solely for the purpose of operating our platform. These providers are bound by confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Contact</h2>
          <p>
            For privacy-related inquiries, email us at <a href="mailto:emmanuelezekwu63@gmail.com" className="text-eventify-600 dark:text-eventify-400 hover:underline">emmanuelezekwu63@gmail.com</a>.
          </p>
        </section>

        <p className="text-sm text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
          Last updated: January 2025
        </p>
      </div>
    </div>
  );
}
