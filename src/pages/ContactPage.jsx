import { FiMail, FiMessageCircle } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Contact Us</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Have a question or need help? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-eventify-50 dark:bg-eventify-900/30 text-eventify-600 dark:text-eventify-400 flex items-center justify-center mb-3">
            <FiMail />
          </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">emmanuelezekwu63@gmail.com</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">We respond within 24 hours</p>
            <a
              href="mailto:emmanuelezekwu63@gmail.com"
              className="mt-4 inline-block text-sm text-eventify-600 font-medium hover:underline"
            >
              Send an email &rarr;
            </a>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-eventify-50 dark:bg-eventify-900/30 text-eventify-600 dark:text-eventify-400 flex items-center justify-center mb-3">
            <FiMessageCircle />
          </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">09033517923</p>
            <a
              href="https://wa.me/2349033517923"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-eventify-600 font-medium hover:underline"
            >
              Chat on WhatsApp &rarr;
            </a>
        </div>
      </div>
    </div>
  );
}
