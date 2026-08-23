import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAdminPayouts,
  processPayout,
  rejectPayout,
  forceFailPayout,
} from "../../services/adminService";
import LoadingSpinner from "../../components/LoadingSpinner";

const STATUS_COLORS = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  PROCESSED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PROCESSING:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  OTP_PENDING:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [forceFailModal, setForceFailModal] = useState(null);
  const [forceFailReason, setForceFailReason] = useState("");

  const load = () => {
    getAdminPayouts()
      .then(setPayouts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleProcess = async (payoutId) => {
    try {
      await processPayout(payoutId);
      toast.success("Payout marked as sent");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process payout");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    try {
      await rejectPayout(rejectModal.id, rejectReason || null);
      toast.success("Payout rejected");
      setRejectModal(null);
      setRejectReason("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject payout");
    }
  };

  const handleForceFail = async () => {
    if (!forceFailModal) return;
    try {
      await forceFailPayout(forceFailModal.id, forceFailReason || null);
      toast.success("Payout force-failed");
      setForceFailModal(null);
      setForceFailReason("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to force-fail payout");
    }
  };

  const filtered = payouts.filter(
    (p) => filter === "ALL" || p.status === filter
  );

  const pendingCount = payouts.filter((p) => p.status === "PENDING").length;

  if (loading) return <LoadingSpinner className="mt-20" size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payouts
        </h1>
        {pendingCount > 0 && (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium px-3 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-eventify-500 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="OTP_PENDING">Awaiting OTP</option>
          <option value="PROCESSED">Processed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((payout) => (
          <div
            key={payout.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {payout.userName}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[payout.status] || ""
                    }`}
                  >
                    {payout.status}
                  </span>
                  {payout.accountNameMismatch && (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      title="Destination account name shares no token with the organiser's signup name, or was not verified"
                    >
                      Name mismatch
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {payout.userEmail}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Amount
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₦{Number(payout.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Bank
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {payout.bankName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Account Number
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {payout.accountNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Account Name
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {payout.accountName || "-"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Reference: {payout.reference} | Requested:{" "}
                  {payout.requestedAt
                    ? new Date(payout.requestedAt).toLocaleString()
                    : "-"}
                  {payout.processedAt &&
                    ` | Processed: ${new Date(payout.processedAt).toLocaleString()}`}
                  {payout.failureReason &&
                    ` | Reason: ${payout.failureReason}`}
                </div>
              </div>

              {payout.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcess(payout.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
                  >
                    Mark Sent
                  </button>
                  <button
                    onClick={() => setRejectModal(payout)}
                    className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}

              {payout.status === "OTP_PENDING" && (
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[16rem] text-right">
                    Waiting for the Paystack OTP. Enter or resend it from the
                    payout actions, or force-fail to release the funds back to
                    the organiser.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForceFailModal(payout)}
                      className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition cursor-pointer"
                    >
                      Force Fail
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No payouts found.
          </p>
        )}
      </div>

      {forceFailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Force Fail Payout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Force-failing #{forceFailModal.id} for{" "}
              {Number(forceFailModal.amount).toLocaleString()} to{" "}
              {forceFailModal.userName}. The backend checks with Paystack first —
              if the transfer actually completed, it settles as paid instead.
              Funds return to the organiser's balance.
            </p>
            <textarea
              value={forceFailReason}
              onChange={(e) => setForceFailReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-eventify-500 mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setForceFailModal(null);
                  setForceFailReason("");
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleForceFail}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
              >
                Force Fail
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Payout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Rejecting payout #{rejectModal.id} for ₦
              {Number(rejectModal.amount).toLocaleString()} to{" "}
              {rejectModal.userName}
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-eventify-500 mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
              >
                Reject Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
