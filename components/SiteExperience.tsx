"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

type ExperiencePhase = "skeleton" | "intro" | "revealing" | "ready";

const SCROLL_POSITION_KEY = "still-site-scroll-position";
// End the supplied footage on its closed shutter, pause briefly on black, then
// reveal the live page through a matching aperture.
const INTRO_CLOSE_SECONDS = 6.08;
const INTRO_BLACK_HOLD_SECONDS = 0.18;

function SiteSkeleton({ active }: { active: boolean }) {
  return (
    <div className="site-skeleton" aria-hidden="true" data-active={active}>
      <div className="site-skeleton__header">
        <div className="site-skeleton__brand">
          <span className="site-skeleton__block site-skeleton__aperture" />
          <span className="site-skeleton__block site-skeleton__brand-name" />
        </div>
        <div className="site-skeleton__nav">
          <span className="site-skeleton__block" />
          <span className="site-skeleton__block" />
          <span className="site-skeleton__block" />
        </div>
        <span className="site-skeleton__block site-skeleton__cta" />
      </div>
      <div className="site-skeleton__hero">
        <div className="site-skeleton__panel site-skeleton__copy">
          <span className="site-skeleton__block site-skeleton__eyebrow" />
          <span className="site-skeleton__block site-skeleton__title" />
          <span className="site-skeleton__block site-skeleton__title site-skeleton__title--short" />
          <span className="site-skeleton__block site-skeleton__line" />
          <span className="site-skeleton__block site-skeleton__line site-skeleton__line--short" />
          <div className="site-skeleton__buttons">
            <span className="site-skeleton__block" />
            <span className="site-skeleton__block" />
          </div>
        </div>
        <span className="site-skeleton__panel site-skeleton__media site-skeleton__media--top" />
        <span className="site-skeleton__panel site-skeleton__media site-skeleton__media--bottom" />
        <div className="site-skeleton__panel site-skeleton__copy site-skeleton__copy--bottom">
          <span className="site-skeleton__block site-skeleton__eyebrow" />
          <span className="site-skeleton__block site-skeleton__line" />
          <span className="site-skeleton__block site-skeleton__line site-skeleton__line--short" />
        </div>
      </div>
    </div>
  );
}

export default function SiteExperience({ children }: { children: ReactNode }) {
  const experienceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const revealingRef = useRef(false);
  const [phase, setPhase] = useState<ExperiencePhase>("skeleton");
  const [introAllowed, setIntroAllowed] = useState(false);

  useEffect(() => {
    const saveScrollPosition = () => {
      try {
        window.sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
      } catch {
        // Storage can be unavailable in private browsing; the live scroll check still applies.
      }
    };

    window.addEventListener("pagehide", saveScrollPosition);

    let savedScrollY = 0;
    try {
      savedScrollY = Number(window.sessionStorage.getItem(SCROLL_POSITION_KEY) ?? 0);
    } catch {
      savedScrollY = 0;
    }

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isRestoredReload = navigation?.type === "reload" && savedScrollY > 48;
    const shouldSkipIntro = prefersReducedMotion
      || window.location.hash.length > 0
      || window.scrollY > 2
      || navigation?.type === "back_forward"
      || isRestoredReload;

    if (shouldSkipIntro) {
      setPhase("ready");
    } else {
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (window.scrollY > 2) {
            setPhase("ready");
          } else {
            setIntroAllowed(true);
          }
        });
      });

      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
        window.removeEventListener("pagehide", saveScrollPosition);
      };
    }

    return () => window.removeEventListener("pagehide", saveScrollPosition);
  }, []);

  const revealSite = useCallback(() => {
    if (revealingRef.current) return;
    revealingRef.current = true;
    videoRef.current?.pause();
    setPhase("revealing");
  }, []);

  const startIntro = useCallback(() => {
    const video = videoRef.current;
    if (!video || startedRef.current) return;

    if (window.scrollY > 2 || window.location.hash.length > 0) {
      setIntroAllowed(false);
      setPhase("ready");
      return;
    }

    startedRef.current = true;
    setPhase("intro");
    void video.play().catch(() => {
      setIntroAllowed(false);
      setPhase("ready");
    });
  }, []);

  const skipIntro = useCallback(() => {
    videoRef.current?.pause();
    setIntroAllowed(false);
    setPhase("ready");
  }, []);

  useEffect(() => {
    if (!introAllowed || phase !== "skeleton") return;
    const timeout = window.setTimeout(() => {
      setIntroAllowed(false);
      setPhase("ready");
    }, 12_000);
    return () => window.clearTimeout(timeout);
  }, [introAllowed, phase]);

  useEffect(() => {
    if (phase !== "intro" && phase !== "revealing") return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") return;
    const safetyCutoff = window.setTimeout(revealSite, 8_000);
    return () => window.clearTimeout(safetyCutoff);
  }, [phase, revealSite]);

  useGSAP(() => {
    const iris = irisRef.current;
    if (phase !== "revealing" || !iris) return;

    const radius = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 1.2);
    const aperture = { radius: 0 };
    iris.style.setProperty("--iris-radius", "0px");

    const timeline = gsap.timeline({
      delay: INTRO_BLACK_HOLD_SECONDS,
      onComplete: () => setPhase("ready"),
    });
    timeline.to(aperture, {
      radius,
      duration: 0.95,
      ease: "power3.inOut",
      onUpdate: () => iris.style.setProperty("--iris-radius", `${aperture.radius}px`),
    });
  }, { scope: experienceRef, dependencies: [phase], revertOnUpdate: true });

  return (
    <div ref={experienceRef} className="site-experience" data-phase={phase} aria-busy={phase !== "ready"}>
      <div className="site-experience__content" aria-hidden={phase !== "ready"} inert={phase !== "ready"}>
        {children}
      </div>

      <SiteSkeleton active={phase === "skeleton"} />

      {introAllowed && phase !== "ready" && (
        <div className="site-intro" role={phase === "intro" ? "dialog" : undefined} aria-modal={phase === "intro" ? true : undefined} aria-label={phase === "intro" ? "Opening camera intro" : undefined} aria-hidden={phase !== "intro"}>
          {phase !== "revealing" && (
            <video
              ref={videoRef}
              className="site-intro__video"
              src="/media/site-intro.mp4"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlayThrough={startIntro}
              onCanPlay={(event) => {
                const video = event.currentTarget;
                const bufferedEnd = video.buffered.length
                  ? video.buffered.end(video.buffered.length - 1)
                  : 0;
                if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && bufferedEnd >= video.duration - 0.1) {
                  startIntro();
                }
              }}
              onProgress={(event) => {
                const video = event.currentTarget;
                const bufferedEnd = video.buffered.length
                  ? video.buffered.end(video.buffered.length - 1)
                  : 0;
                if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && bufferedEnd >= video.duration - 0.1) {
                  startIntro();
                }
              }}
              onTimeUpdate={(event) => {
                if (event.currentTarget.currentTime >= INTRO_CLOSE_SECONDS) revealSite();
              }}
              onEnded={revealSite}
              onError={() => {
                setIntroAllowed(false);
                setPhase("ready");
              }}
            />
          )}
          {phase === "revealing" && <div ref={irisRef} className="site-intro__iris" aria-hidden="true" />}
          {phase === "intro" && (
            <button className="site-intro__skip" type="button" onClick={skipIntro}>
              Skip intro
            </button>
          )}
        </div>
      )}
    </div>
  );
}
