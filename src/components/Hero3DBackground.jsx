export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
      {/* Floating morphing shape */}
      <div className="hero-shape absolute top-10 left-[10%] w-40 h-40 sm:w-56 sm:h-56 bg-white/5 border border-white/10 orbit-1" />

      {/* Rotating ring */}
      <div className="absolute top-20 right-[15%] w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-eventify-300/40 rounded-full" />
      </div>

      {/* Small floating cube */}
      <div className="orbit-2" style={{ position: "absolute", bottom: "20%", left: "20%" }}>
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-eventify-400/10 border border-eventify-300/20 rounded-lg" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-eventify-400/5 rounded-lg" style={{ transform: "translateZ(8px)" }} />
        </div>
      </div>

      {/* Glowing dot */}
      <div className="orbit-3" style={{ position: "absolute", top: "40%", right: "10%" }}>
        <div className="w-2 h-2 bg-eventify-300 rounded-full shadow-[0_0_12px_2px_rgba(16,185,129,0.4)]" />
      </div>

      {/* Large soft glow */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-eventify-400/10 rounded-full blur-3xl orbit-2" />

      {/* Grid lines (subtle) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}
