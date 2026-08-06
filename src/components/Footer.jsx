import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-10 xl:px-0 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-200 dark:border-gray-700">
          <div className="md:col-span-1">
            <Link to="/" className="block mb-4">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Eventify</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Your modern event ticketing platform. Create, sell, and manage events effortlessly.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/emmanuelezekwu63?utm_source=qr&igsh=MWx6dDQ1ZjIwd3BieA=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-eventify-500 hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition-colors"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-700 dark:text-gray-300">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.83 2.013 9.075 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2.5">
                <li><Link to="/events" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Events</Link></li>
                <li><a href="/#pricing" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5">
                <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</Link></li>
                <li><a href="/#faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">FAQs</a></li>
                <li><Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><a href="https://play.google.com/store/apps/details?id=com.brandiblebms.app&hl=en" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Brandible</a></li>
              </ul>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="rounded-2xl border border-eventify-200/40 bg-eventify-50/90 p-5 shadow-sm dark:border-eventify-800/50 dark:bg-eventify-950/35">
              <p className="mb-1 text-sm font-bold text-eventify-900 dark:text-eventify-100">Ready to sell tickets?</p>
              <p className="mb-4 text-xs text-eventify-900/75 dark:text-eventify-200/85">Join hundreds of organizers on Eventify today.</p>
              <Link
                to="/register"
                className="block rounded-full bg-eventify-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-eventify-700 dark:bg-eventify-500 dark:hover:bg-eventify-400"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            <a href="mailto:emmanuelezekwu63@gmail.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}