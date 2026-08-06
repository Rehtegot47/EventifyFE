import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { verifyOrder } from "../services/paymentService";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }
    verifyOrder(reference)
      .then((res) => {
        if (res.paymentStatus === "PAID") {
          setStatus("success");
          setOrder(res);
        } else {
          setStatus("error");
          setOrder(res);
        }
      })
      .catch(() => setStatus("error"));
  }, [reference]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {status === "verifying" && (
        <>
          <FiLoader className="animate-spin text-5xl text-eventify-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying Payment...
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we confirm your payment.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Your tickets have been confirmed.
          </p>
          {order?.orderRef && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
              Order ref: <span className="font-mono">{order.orderRef}</span>
            </p>
          )}
          {order?.eventTitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {order.eventTitle}
            </p>
          )}
          {order?.tickets?.length > 0 && (
            <p className="text-sm text-eventify-600 dark:text-eventify-400 mb-6">
              {order.tickets.length} ticket{order.tickets.length > 1 ? "s" : ""} generated
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/tickets"
              className="px-6 py-3 bg-eventify-500 text-white rounded-lg font-semibold hover:bg-eventify-600 transition"
            >
              View My Tickets
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <FiXCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn&apos;t verify your payment. If you were charged, please contact support with your reference.
          </p>
          {reference && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Reference: <span className="font-mono">{reference}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/tickets"
              className="px-6 py-3 bg-eventify-500 text-white rounded-lg font-semibold hover:bg-eventify-600 transition"
            >
              Check My Tickets
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
