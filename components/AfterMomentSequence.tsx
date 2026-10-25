"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { media } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AfterMomentSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stage = section.querySelector<HTMLElement>(".after-moment__stage");
    const visual = section.querySelector<HTMLElement>(".after-moment__visual");
    const title = section.querySelector<HTMLElement>(".after-moment__title");
    const copy = section.querySelector<HTMLElement>(".after-moment__body");
    const deck = section.querySelector<HTMLElement>(".after-moment__deck");
    const cards = gsap.utils.toArray<HTMLElement>(".after-moment__card", section);
    if (!stage || !visual || !title || !copy || !deck || cards.length === 0) return;

    const stageRect = stage.getBoundingClientRect();
    const centerX = stageRect.left + stageRect.width / 2;
    const centerY = stageRect.top + stageRect.height / 2;
    const gather = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        x: centerX - (rect.left + rect.width / 2),
        y: centerY - (rect.top + rect.height / 2),
      };
    });
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const finalCards = [-8, 6, -5, 9, -10, 7, -4, 0, 0, 0, 0];

    gsap.set(title, { left: "50%", top: "50%", width: mobile ? "86%" : "68%", xPercent: -50, yPercent: -50, autoAlpha: 0, textAlign: "center" });
    gsap.set(copy, { autoAlpha: 0, y: 24 });
    gsap.set(visual, {
      left: "50%",
      top: "50%",
      width: mobile ? "92%" : Math.min(window.innerWidth * 0.66, 1120),
      height: mobile ? Math.min(window.innerHeight * 0.48, 440) : Math.min(window.innerHeight * 0.75, 710),
      xPercent: -50,
      yPercent: -50,
      scale: 0.82,
      autoAlpha: 1,
    });
    gsap.set(cards, {
      x: (index) => (index % 2 === 0 ? -1 : 1) * (window.innerWidth * 0.7 + 220),
      y: (index) => (index % 3 === 0 ? -1 : 1) * window.innerHeight * 0.12,
      rotation: (index) => (index % 2 === 0 ? -1 : 1) * 18,
      scale: 0.78,
      autoAlpha: 0,
    });

    const finalTitle = mobile
      ? { left: "37%", top: "7%", width: "58%" }
      : { left: "55%", top: "8%", width: "37%" };
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top+=76px",
        end: () => `+=${Math.round(window.innerHeight * 1.7)}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(visual, { left: "0%", top: "0%", width: "100vw", height: "100%", xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 1, duration: 1.05, ease: "power4.inOut" }, 0.13)
      .to(title, { autoAlpha: 1, duration: 0.1, ease: "power4.out" }, 0.1)
      .to(title, { ...finalTitle, xPercent: 0, yPercent: 0, textAlign: "right", duration: 0.25, ease: "power4.inOut" }, 0.24)
      .to(cards, { x: (index) => gather[index].x, y: (index) => gather[index].y, rotation: (index) => (index % 2 === 0 ? -1 : 1) * (10 + index), scale: 0.84, autoAlpha: 1, stagger: 0.018, duration: 0.2, ease: "power4.out" }, 0.43)
      .to(deck, { rotation: 360, scale: 0.9, duration: 0.2, ease: "power4.inOut" }, 0.62)
      .to(cards, { x: 0, y: 0, rotation: (index) => finalCards[index % finalCards.length], scale: 1, duration: 0.22, ease: "expo.out" }, 0.72)
      .to(copy, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power4.out" }, 1.18);

    return () => timeline.scrollTrigger?.kill();
  }, { scope: root, dependencies: [] });

  return (
    <section className="after-moment" ref={root} aria-labelledby="after-moment-title">
      <div className="after-moment__stage">
        <figure className="after-moment__visual">
          <video className="after-moment__landscape" autoPlay muted loop playsInline preload="metadata" poster={media.scenePoster.src} aria-label="A moving aerial view across a still mountain lake and sunlit hills.">
            <source src={media.sceneryVideo} type="video/mp4" />
          </video>
          <span className="after-moment__shade" aria-hidden="true" />
          <span className="after-moment__corners" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="after-moment__camera-meta" aria-hidden="true"><span>STILL / FRAME 001</span><span>10:08 <b>▰</b></span></span>
          <span className="after-moment__camera-bottom" aria-hidden="true"><span>ISO 100</span><span>F 1.8</span><span>THE MOMENT, AS IT WAS</span></span>
          <figcaption className="after-moment__visual-caption">A moving view. A moment held.</figcaption>
        </figure>

        <div className="after-moment__deck" aria-hidden="true">
          {media.introMoments.map((moment, index) => (
            <figure className={`after-moment__card after-moment__card--${index + 1}`} key={moment.label}>
              <img src={moment.src} alt="" />
              <figcaption>{moment.label}</figcaption>
            </figure>
          ))}
        </div>

        <h2 className="after-moment__title" id="after-moment-title">Keep the moment.<br />Let the rest move.</h2>
        <div className="after-moment__body">
          <p>A photograph can be for you. A way to return to a face, a light, a day you almost hurried through.</p>
          <p>The concept leaves room for the image to matter without asking what comes next.</p>
        </div>
      </div>
    </section>
  );
}
