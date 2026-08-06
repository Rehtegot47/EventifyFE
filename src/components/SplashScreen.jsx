import { useState, useEffect } from "react";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1000);
    const t4 = setTimeout(() => setPhase(4), 2000);
    const t5 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`transition-all duration-700 ease-out ${
          phase >= 1
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4"
        }`}
      >
        <img
          src="/Eventify logos.png"
          alt="Eventify"
          className="w-28 h-28 mx-auto drop-shadow-lg"
        />
      </div>

      <div className="mt-4 flex flex-col items-center">
        <h1
          className={`text-3xl tracking-tight transition-all duration-700 ease-out ${
            phase >= 1
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
          style={{
            fontWeight: phase >= 2 ? 900 : 100,
            letterSpacing: phase >= 2 ? "-0.02em" : "0.05em",
            transition: "font-weight 0.8s cubic-bezier(0.22, 1, 0.36, 1), letter-spacing 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s, transform 0.5s",
          }}
        >
          Eventify
        </h1>

        <div className="relative mt-2 h-[2px] w-24 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 bg-eventify-500 rounded-full transition-all duration-700 ease-out ${
              phase >= 2 ? "w-24 opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>

        <p
          className={`mt-2 text-sm text-gray-400 tracking-wide transition-all duration-500 ease-out ${
            phase >= 3
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {"Discover. Book. Experience.".split(" ").map((word, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: phase >= 3 ? `kinetic-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both` : "none",
                opacity: phase >= 3 ? undefined : 0,
              }}
            >
              {word}
              {i < 2 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
