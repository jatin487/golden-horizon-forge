import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: (props: {
    scrollProgress: number;
    scrollToProgress: (progress: number) => void;
  }) => React.ReactNode;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    const handleScroll = (e: { progress: number }) => {
      setScrollProgress(e.progress);
    };

    lenis.on("scroll", handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToProgress = (progress: number) => {
    if (!lenisRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = progress * maxScroll;
    lenisRef.current.scrollTo(targetY, { duration: 2 });
  };

  return <>{children({ scrollProgress, scrollToProgress })}</>;
};
