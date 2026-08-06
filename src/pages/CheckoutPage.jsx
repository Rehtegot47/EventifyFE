import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventBySlug } from "../services/eventService";
import { initiateOrder } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CheckoutPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qty = Number(searchParams.get("qty")) || 1;
  const typeId = searchParams.get("type") || "";
  const eventId = searchParams.get("eventId") || "";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [buyerName, setBuyerName] = useState(user?.name || "");
  const [buyerEmail, setBuyerEmail] = useState(user?.email || "");
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  useEffect(() => {
    getEventBySlug(slug)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user) {
      setBuyerName((prev) => prev || user.name || "");
      setBuyerEmail((prev) => prev || user.email || "");
    }
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-500">
        Event not found
      </div>
    );
  }

  const selectedType = event.ticketTypes?.find((t) => t._id?.toString() === typeId) || event.ticketTypes?.[0];
  const price = selectedType ? selectedType.price : event.price;
  const total = price * qty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) {
      return toast.error("Please fill in your name and email");
    }
    setSubmitting(true);
    try {
      const res = await initiateOrder({
        eventId: Number(eventId) || event._id,
        ticketTypeId: typeId ? Number(typeId) : Number(selectedType?._id),
        quantity: qty,
        buyerEmail: buyerEmail.trim(),
        buyerName: buyerName.trim(),
        discountCode: discountCode.trim() || undefined,
        paymentMethod: paymentMethod === "transfer" ? "TRANSFER" : "PAYSTACK",
      });
      if (res.paystackUrl) {
        window.location.href = res.paystackUrl;
      } else if (paymentMethod === "transfer") {
        toast.success("Order placed! Please transfer the exact amount. Your ticket will be confirmed after payment verification.");
        navigate("/tickets");
      } else {
        toast.success("Order placed successfully!");
        navigate("/tickets");
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Details</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount Code</label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter promo code (optional)"
                  className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Method</label>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paystack")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition cursor-pointer ${
                      paymentMethod === "paystack"
                        ? "border-eventify-500 bg-eventify-50 dark:bg-eventify-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "paystack" ? "border-eventify-500" : "border-gray-400"}`}>
                      {paymentMethod === "paystack" && <div className="w-2 h-2 rounded-full bg-eventify-500" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">Paystack (Card / Bank)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pay securely with card or bank transfer online</p>
                    </div>
                  </button>

                  {(event.bankName || event.bankAccountNumber || event.bankAccountName) && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("transfer")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition cursor-pointer ${
                        paymentMethod === "transfer"
                          ? "border-eventify-500 bg-eventify-50 dark:bg-eventify-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "transfer" ? "border-eventify-500" : "border-gray-400"}`}>
                        {paymentMethod === "transfer" && <div className="w-2 h-2 rounded-full bg-eventify-500" />}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">Bank Transfer (Manual)</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Transfer directly to the organizer's bank account</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {paymentMethod === "transfer" && (event.bankName || event.bankAccountNumber || event.bankAccountName) && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 mt-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2">Transfer to this account</p>
                  <div className="space-y-1 text-sm">
                    {event.bankName && (
                      <div className="flex justify-between text-amber-800 dark:text-amber-200">
                        <span className="text-amber-600 dark:text-amber-400">Bank</span>
                        <span className="font-semibold">{event.bankName}</span>
                      </div>
                    )}
                    {event.bankAccountNumber && (
                      <div className="flex justify-between text-amber-800 dark:text-amber-200">
                        <span className="text-amber-600 dark:text-amber-400">Account Number</span>
                        <span className="font-semibold font-mono">{event.bankAccountNumber}</span>
                      </div>
                    )}
                    {event.bankAccountName && (
                      <div className="flex justify-between text-amber-800 dark:text-amber-200">
                        <span className="text-amber-600 dark:text-amber-400">Account Name</span>
                        <span className="font-semibold">{event.bankAccountName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-amber-800 dark:text-amber-200 border-t border-amber-200 dark:border-amber-700/50 pt-1 mt-1">
                      <span className="text-amber-600 dark:text-amber-400">Amount</span>
                      <span className="font-bold text-base">\u20A6{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    After transferring, your ticket will be confirmed once the organizer verifies payment.
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {paymentMethod === "paystack"
                  ? "You will be redirected to Paystack to complete payment securely."
                  : "Transfer the exact amount shown. Your ticket will be confirmed after payment verification."}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-eventify-500 text-white py-3 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-60 mt-2 cursor-pointer"
              >
                {submitting
                  ? (paymentMethod === "transfer" ? "Placing order..." : "Redirecting to payment...")
                  : (paymentMethod === "transfer" ? `Place Order \u2014 \u20A6${total.toFixed(2)}` : `Pay \u20A6${total.toFixed(2)}`)}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <img
                  src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                <p className="text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                {selectedType && (
                  <p className="text-xs text-eventify-600 dark:text-eventify-400 mt-0.5">{selectedType.name}</p>
                )}
              </div>
            </div>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Price per ticket</span>
                <span>\u20A6{price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Quantity</span>
                <span>{qty}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-base border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <span>Total</span>
                <span className="text-eventify-600 dark:text-eventify-400">\u20A6{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
