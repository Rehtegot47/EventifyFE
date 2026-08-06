import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FiCamera, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { scanTicket } from "../services/checkInService";

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setScanning(true);
    setResult(null);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          stopScanner();
          setChecking(true);
          try {
            const res = await scanTicket(decodedText);
            setResult({
              success: true,
              message: res.message || "Check-in successful",
              attendeeName: res.attendeeName || "",
              ticketType: res.ticketType || "",
            });
            toast.success(res.message || "Check-in successful!");
          } catch (err) {
            setResult({
              success: false,
              message: err.message || "Check-in failed",
            });
            toast.error(err.message || "Check-in failed");
          } finally {
            setChecking(false);
          }
        },
        () => {}
      );
    } catch {
      toast.error("Camera access denied or not available");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Check-In</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Scan attendee tickets at the door using your camera
      </p>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div id="qr-reader" className={scanning ? "block" : "hidden"} />

        {!scanning && !result && !checking && (
          <div className="text-center py-10">
            <FiCamera className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Position the QR code in front of your camera
            </p>
            <button
              onClick={startScanner}
              className="px-6 py-2.5 bg-eventify-500 text-white rounded-lg font-medium hover:bg-eventify-600 transition cursor-pointer"
            >
              Start Scanning
            </button>
          </div>
        )}

        {checking && (
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-eventify-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Verifying ticket...</p>
          </div>
        )}

        {result && (
          <div className="text-center py-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${
              result.success
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }`}>
              {result.success ? <FiX className="rotate-45" /> : <FiX />}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {result.success ? "Check-In Successful" : "Check-In Failed"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{result.message}</p>
            {result.attendeeName && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Attendee: <span className="font-medium">{result.attendeeName}</span>
              </p>
            )}
            {result.ticketType && (
              <p className="text-xs text-eventify-600 dark:text-eventify-400 mt-1">{result.ticketType}</p>
            )}
            <button
              onClick={() => {
                setResult(null);
                startScanner();
              }}
              className="mt-4 px-6 py-2 bg-eventify-500 text-white rounded-lg font-medium hover:bg-eventify-600 transition cursor-pointer"
            >
              Scan Next
            </button>
          </div>
        )}

        {scanning && (
          <div className="mt-4 text-center">
            <button
              onClick={stopScanner}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              Stop Scanning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
