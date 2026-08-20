import { useEffect, useRef, useState } from "react";

const UI_FONT = "'Bebas Neue', Impact, 'Arial Black', sans-serif";
const IMAGES = Array.from({ length: 12 }, (_, i) => `/EVE${i + 1}.jpg`);
const DESKTOP_LINES = ["EVENTIFY"];
const SPEED = 40;

export default function MobileBurgerHero({ containerRef }) {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [dimensions, setDimensions] = useState({
    vw: 390,
    vh: 250,
    tileW: 400,
  });
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef?.current) return;
      const w = containerRef.current.offsetWidth;
      const mobile = w < 640;
      setIsMobile(mobile);
      const tileWidth = Math.max(200, w * 0.3);
      const h = Math.max(300, w * 0.27);
      setDimensions({ vw: w, vh: h, tileW: tileWidth });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef?.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const STRIP_TOTAL_W = dimensions.tileW * IMAGES.length;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      setOffset((elapsed * SPEED) % STRIP_TOTAL_W);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dimensions.tileW]);

  const allImages = [...IMAGES, ...IMAGES];

  const FONT_SIZE = Math.max(80, dimensions.vw * 0.3);
  const LINE_HEIGHT = FONT_SIZE * 1.05;

  const getTextProps = (lineIndex) => ({
    x: dimensions.vw / 2,
    y: FONT_SIZE * 0.82 + lineIndex * LINE_HEIGHT,
    textAnchor: "middle",
    style: {
      fontFamily: UI_FONT,
      fontSize: FONT_SIZE,
      fontWeight: 900,
    },
  });

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${dimensions.vw} ${dimensions.vh}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="w-full block"
        style={{
          maxHeight: "clamp(200px, 60vh, 500px)",
          aspectRatio: `${dimensions.vw} / ${dimensions.vh}`,
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="letterClipDesktop">
            {DESKTOP_LINES.map((line, i) => (
              <text key={i} {...getTextProps(i)}>
                {line}
              </text>
            ))}
          </clipPath>
        </defs>

        <rect
          width={dimensions.vw}
          height={dimensions.vh}
          fill="#6B7C2F"
        />

        {DESKTOP_LINES.map((line, i) => (
          <text key={i} {...getTextProps(i)} fill="#111">
            {line}
          </text>
        ))}

        <g clipPath="url(#letterClipDesktop)">
          <g transform={`translate(${-offset}, 0)`}>
            {allImages.map((src, i) => (
              <image
                key={i}
                href={src}
                x={i * dimensions.tileW}
                y={0}
                width={dimensions.tileW}
                height={dimensions.vh}
                preserveAspectRatio="xMidYMid slice"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
