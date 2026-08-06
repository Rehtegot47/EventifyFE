import { useEffect, useRef, useState } from "react";

export function KineticText({ text, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="kinetic-word">
          <span
            className="kinetic-word-inner"
            style={{
              animationDelay: visible ? `${delay + i * 0.1}s` : undefined,
              animationPlayState: visible ? "running" : "paused",
              opacity: visible ? undefined : 0,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

export function VariableText({ text, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`variable-text ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationPlayState: visible ? "running" : "paused",
        opacity: visible ? undefined : 0,
      }}
    >
      {text}
    </span>
  );
}

export function StaggerLetters({ text, className = "", tag: Tag = "span" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="stagger-letter"
          style={{
            animationDelay: visible ? `${i * 0.03}s` : undefined,
            animationPlayState: visible ? "running" : "paused",
            opacity: visible ? undefined : 0,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
