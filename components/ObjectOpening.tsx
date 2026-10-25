"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const openingLine = "Take a closer look.";

export default function ObjectOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !stage || !video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const phrase = section.querySelector<HTMLElement>(".object__opening-line");
    const opening = section.querySelector<HTMLElement>(".object__opening");
    const characters = gsap.utils.toArray<HTMLElement>("[data-object-char]", section);
    const cursor = section.querySelector<HTMLElement>(".object__opening-cursor");
    const headline = section.querySelector<HTMLElement>(".object__heading h2");
    const subtext = section.querySelector<HTMLElement>(".object__intro");
    const image = section.querySelector<HTMLElement>(".object__photo-wrap");
    if (!phrase || !opening || !characters.length || !cursor || !headline || !subtext || !image) return;

    gsap.set(characters, { autoAlpha: 0 });
    gsap.set(cursor, { autoAlpha: 0 });
    gsap.set(headline, { x: -90, autoAlpha: 0 });
    gsap.set(subtext, { x: 90, autoAlpha: 0 });
    gsap.set(image, { y: 96, autoAlpha: 0 });

    const typeStart = 0.08;
    const typeEnd = typeStart + (characters.length - 1) * 0.046 + 0.01;
    const zoomStart = typeEnd + 0.12;
    // Begin the page reveal before the white intro layer has fully cleared, so there is no blank beat.
    const pageStart = zoomStart + 0.18;
    const entranceDuration = 0.58;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: stage,
        start: () => `top top+=${window.innerWidth <= 700 ? 66 : 76}px`,
        end: () => `+=${window.innerHeight * 1.8}`,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress >= 0.62 && video.paused) {
            void video.play().catch(() => undefined);
          } else if (self.progress < 0.62 && !video.paused) {
            video.pause();
          }
        },
      },
    });

    // Keep the AirGlass character-by-character reveal, with the scroll controlling its pace.
    timeline.fromTo(characters, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 0.01,
      stagger: 0.046,
      ease: "none",
    }, typeStart);
    timeline.to(cursor, { autoAlpha: 1, duration: 0.01, ease: "none" }, typeEnd);

    // Once the line is complete, enlarge and dissolve it as the three page elements arrive together.
    timeline.to(phrase, {
      scale: 1.42,
      autoAlpha: 0,
      duration: 0.46,
      ease: "power3.in",
    }, zoomStart);
    timeline.to(opening, { autoAlpha: 0, duration: 0.46, ease: "none" }, zoomStart);
    timeline.to(headline, {
      x: 0,
      autoAlpha: 1,
      duration: entranceDuration,
      ease: "power3.out",
    }, pageStart);
    timeline.to(subtext, {
      x: 0,
      autoAlpha: 1,
      duration: entranceDuration,
      ease: "power3.out",
    }, pageStart);
    timeline.to(image, {
      y: 0,
      autoAlpha: 1,
      duration: entranceDuration,
      ease: "power3.out",
    }, pageStart);

    ScrollTrigger.refresh();
  }, { scope: sectionRef });

  return (
    <section id="in-hand" ref={sectionRef} className="object" aria-labelledby="object-title">
      <div ref={stageRef} className="object__stage">
        <div className="object__opening">
          <p className="object__opening-line">
            <span className="sr-only">{openingLine}</span>
            <span aria-hidden="true">
              {Array.from(openingLine).map((character, index) => (
                <span className="object__opening-character" data-object-char key={`${character}-${index}`}>
                  {character === " " ? "\u00a0" : character}
                </span>
              ))}
            </span>
            <i className="object__opening-cursor" aria-hidden="true" />
          </p>
        </div>

        <div className="object__content">
          <div className="object__heading">
            <h2 id="object-title">A small invitation<br />to look closer.</h2>
            <p className="object__intro">A familiar shape, considered as an everyday object. The details are still open; the intention is to make reaching for a camera feel natural, not like opening another app.</p>
          </div>
          <figure className="object__photo-wrap">
            <video
              ref={videoRef}
              className="object__video"
              muted
              loop
              playsInline
              preload="auto"
              aria-label="A high-grade camera separates into its individual components, then comes back together."
            >
              <source src="/media/camera-exploded-view.mp4" type="video/mp4" />
            </video>
            <div className="object__photo-overlay" aria-hidden="true" />
            <figcaption className="object__annotation object__annotation--top">A considered object</figcaption>
            <span className="object__annotation object__annotation--bottom">Form / material / gesture</span>
          </figure>
        </div>
      </div>
    </section>
  );
}
