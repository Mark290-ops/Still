"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ScrollReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [observing, setObserving] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    setObserving(true);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stateClass = observing && !visible ? " reveal--pending" : " reveal--visible";
  return <div ref={element} className={`reveal${stateClass} ${className}`}>{children}</div>;
}
