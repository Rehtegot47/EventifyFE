import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiChevronDown } from "react-icons/fi";
import { getEvents, getCategories } from "../services/eventService";
import EventCard from "../components/EventCard";
import CategoryCard from "../components/CategoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Reveal from "../components/Reveal";
import MobileBurgerHero from "../components/MobileBurgerHero";
import { KineticText, StaggerLetters } from "../components/KineticText";
import Hero3DBackground from "../components/Hero3DBackground";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Event",
    desc: "Add your poster, write your event story, set ticket options, and publish with a clean public link.",
    image: "/images/Tech.jpg",
  },
  {
    step: "02",
    title: "Sell Tickets Online",
    desc: "Share your unique event link anywhere. Attendees pay securely and instantly receive QR-coded tickets.",
    image: "/images/tech2.jfif",
  },
  {
    step: "03",
    title: "Check In & Get Paid",
    desc: "Scan attendees at the door using your phone. Request a payout anytime and receive it the next business day.",
    image: "/images/Food events.jfif",
  },
];

const FEATURES = [
  {
    title: "QR Code Check-In",
    desc: "Every ticket gets a unique QR code. Scan attendees at the gate in seconds using just your phone.",
  },
  {
    title: "Discount Codes",
    desc: "Reward early buyers with promo codes. Set expiry dates and usage limits to create urgency.",
  },
  {
    title: "Referral Links",
    desc: "Turn your audience into your marketing team. Track how many tickets each referral brings in.",
  },
  {
    title: "Complimentary Tickets",
    desc: "Issue free tickets to VIPs, media, or partners instantly with full QR-coded access.",
  },
  {
    title: "Live Analytics",
    desc: "Watch sales, check-in rates, and revenue in real time from your dashboard.",
  },
  {
    title: "Fraud-Proof Tickets",
    desc: "Each ticket is cryptographically unique. Duplicates or tampered codes are flagged instantly.",
  },
];

const FAQS = [
  {
    q: "How much does it cost to use this platform?",
    a: "Free events are completely free. For paid ticketed events, we charge 5% + ₦100 per ticket sold. Voting events are charged at 8%. There are no hidden fees.",
  },
  {
    q: "Are there any hidden fees?",
    a: "None. The fee structure is transparent — what you see is what you get. Free events stay free forever.",
  },
  {
    q: "How is the service fee deducted?",
    a: "Fees are deducted automatically from each ticket sale before funds are added to your available balance.",
  },
  {
    q: "Do buyers pay extra fees?",
    a: "No. Buyers pay the ticket price you set. Our service fee is deducted from your side.",
  },
  {
    q: "How do I get paid for ticket sales?",
    a: "You can request a payout anytime from your dashboard. Funds are transferred to your bank account.",
  },
  {
    q: "When will I receive my payouts?",
    a: "Payouts are processed the next business day after your request.",
  },
  {
    q: "How do I check in attendees?",
    a: "Use your phone camera to scan the unique QR code on each attendee's ticket. No extra hardware needed.",
  },
];

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const heroBannerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getEvents().then((res) => {
        const list = res.events || res || [];
        setEvents(list.slice(0, 3));
      }),
      getCategories().then(setCategories).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-to-br from-eventify-500 via-eventify-600 to-eventify-800 animate-gradient text-white overflow-hidden">
        <Hero3DBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <Reveal>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
                  <KineticText text="Event Ticketing," />
                  <br />
                  <span className="text-eventify-200">
                    <KineticText text="Simplified" delay={0.3} />
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl">
                  Create your event in minutes. Sell tickets online with secure payments. Scan attendees at the door. Track every sale in real time.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-white text-eventify-700 px-6 py-3 sm:px-8 rounded-lg font-semibold hover:bg-eventify-50 transition"
                  >
                    Start Selling Tickets <FiArrowRight />
                  </Link>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-6 py-3 sm:px-8 rounded-lg font-semibold hover:bg-white/10 transition"
                  >
                    Browse Events
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={450}>
                <div className="mt-10 sm:mt-12 flex items-center gap-6 sm:gap-8 lg:gap-12 flex-wrap justify-center lg:justify-start">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">500+</p>
                    <p className="text-xs sm:text-sm text-white/70">Events Hosted</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">20K+</p>
                    <p className="text-xs sm:text-sm text-white/70">Tickets Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">100+</p>
                    <p className="text-xs sm:text-sm text-white/70">Organizers</p>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <Reveal delay={200}>
                <div className="relative animate-float-slow">
                  <img
                    src="/images/music.jfif"
                    alt="Event"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl rotate-3"
                  />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-eventify-400/20 rounded-full blur-xl animate-float" />
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>
              </Reveal>
              <div className="absolute -top-6 right-12 w-20 h-20 bg-eventify-300/30 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-8 left-0 w-28 h-28 bg-white/5 rounded-full blur-xl animate-float-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hero Banner ─── */}
      <div ref={heroBannerRef} className="w-full -mt-8 relative z-10">
        <MobileBurgerHero containerRef={heroBannerRef} />
      </div>

      {/* ─── How It Works ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
            <StaggerLetters text="Three steps to" tag="span" />
            {" "}
            <span className="text-eventify-600">
              <StaggerLetters text="a stronger event launch" tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xl mx-auto">
            No technical skills required. If you can share a link, you can sell tickets.
          </p>
        </Reveal>
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={i * 150}>
              <div className="group text-center">
                <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-5 shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-eventify-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
              <StaggerLetters text="Everything you need to run a great event" tag="span" />
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xl mx-auto">
              All the tools serious organizers use — included in every plan, at no extra cost.
            </p>
          </Reveal>
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-eventify-50 dark:bg-eventify-900/30 text-eventify-600 dark:text-eventify-400 flex items-center justify-center mb-4">
                    <FiCheck />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
            <StaggerLetters text="Clear pricing." tag="span" />
            {" "}
            <span className="text-eventify-600">
              <StaggerLetters text="No mystery math." tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xl mx-auto">
            Free events stay free. Paid events charged at 5% + ₦100 per ticket. Simple.
          </p>
        </Reveal>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Reveal delay={0}>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-sm bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Free Events</h3>
              <p className="mt-2 text-3xl font-bold text-eventify-600">₦0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Per ticket, always.</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Host a free event at zero cost. Create, share, and fill your seats completely free.
              </p>
              <Link
                to="/register"
                className="mt-4 block text-center px-4 py-2 border border-eventify-500 text-eventify-600 rounded-lg font-medium hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition text-sm"
              >
                Get Started
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="border-2 border-eventify-500 rounded-xl p-5 sm:p-6 shadow-sm bg-white dark:bg-gray-800 relative">
              <span className="absolute -top-2.5 right-4 bg-eventify-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                Most Used
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ticket Events</h3>
              <p className="mt-2 text-3xl font-bold text-eventify-600">5%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">+ ₦100 per paid ticket</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                For regular ticketed events. Predictable pricing so organizers can plan profits clearly.
              </p>
              <Link
                to="/register"
                className="mt-4 block text-center px-4 py-2 bg-eventify-500 text-white rounded-lg font-medium hover:bg-eventify-600 transition text-sm"
              >
                Get Started
              </Link>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-sm bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Voting Events</h3>
              <p className="mt-2 text-3xl font-bold text-eventify-600">8%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Per vote purchase</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Built for paid voting experiences with transparent fee handling and live tracking.
              </p>
              <Link
                to="/register"
                className="mt-4 block text-center px-4 py-2 border border-eventify-500 text-eventify-600 rounded-lg font-medium hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition text-sm"
              >
                Get Started
              </Link>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-sm bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-gray-900 dark:text-white">Custom Services</h3>
              <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">Quote</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tailored for your needs</p>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                <li>Event wrist tags &amp; printing</li>
                <li>On-site ticketing support</li>
                <li>Custom operations setup</li>
              </ul>
              <a
                href="mailto:emmanuelezekwu63@gmail.com"
                className="mt-4 block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
              >
                Contact Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Live Events ─── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
              Events happening on Eventify
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Real events, real energy. See what organizers are creating every day.
            </p>
          </Reveal>
          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.slice(0, 6).map((evt, i) => (
                <Reveal key={evt._id} delay={i * 100}>
                  <EventCard event={evt} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">Browse by Category</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <Reveal key={cat._id} delay={i * 80}>
              <CategoryCard category={cat} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="bg-gray-50 dark:bg-gray-900/50 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
              Questions, <span className="text-eventify-600">answered clearly.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Everything you need to know about selling tickets on Eventify.
            </p>
          </Reveal>
          <div className="mt-8 sm:mt-10 flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                  >
                    {faq.q}
                    <FiChevronDown
                      className={`shrink-0 transition-transform duration-200 text-gray-500 dark:text-gray-400 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Still have questions?{" "}
            <a href="mailto:emmanuelezekwu63@gmail.com" className="text-eventify-600 font-medium hover:underline">
              Chat with us
            </a>
          </p>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-gradient-to-br from-eventify-500 via-eventify-600 to-eventify-800 animate-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Your next event deserves{" "}
              <span className="text-eventify-200">better ticketing</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Join hundreds of organizers selling out their events on Eventify. Setup is free and takes
              less than 5 minutes.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-eventify-700 px-6 py-3 sm:px-8 rounded-lg font-semibold hover:bg-eventify-50 transition"
              >
                Create Free Account <FiArrowRight />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-6 py-3 sm:px-8 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Browse Events
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
