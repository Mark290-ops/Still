"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageFrame from "@/components/ImageFrame";
import { media } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const introMoment = media.introMoments[0];

export default function IdeaIntroSequence() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const raw = section.querySelector<HTMLElement>(".about-intro__card--raw");
    const process = section.querySelector<HTMLElement>(".about-intro__card--process");
    const final = section.querySelector<HTMLElement>(".about-intro__card--final");
    const rawCaption = section.querySelector<HTMLElement>(".about-intro__caption--raw");
    const processCaption = section.querySelector<HTMLElement>(".about-intro__caption--process");
    const finalCaption = section.querySelector<HTMLElement>(".about-intro__caption--final");
    const shade = section.querySelector<HTMLElement>(".about-intro__shade");
    const reveal = section.querySelector<HTMLElement>(".about-intro__reveal");
    const headline = section.querySelector<HTMLElement>(".about-intro__reveal h2");
    const headlineAccent = section.querySelector<HTMLElement>(".about-intro__reveal h2 em");
    const aboutPage = section.querySelector<HTMLElement>(".about-page-layer");
    const aboutMedia = section.querySelector<HTMLElement>(".about-page-media");
    const aboutContent = section.querySelector<HTMLElement>(".about-page-content");
    const aboutVideo = section.querySelector<HTMLVideoElement>(".about-page-media video");
    const stage = section.querySelector<HTMLElement>(".about-intro__stage");
    if (!raw || !process || !final || !rawCaption || !processCaption || !finalCaption || !shade || !reveal || !headline || !headlineAccent || !aboutPage || !aboutMedia || !aboutContent || !aboutVideo || !stage) return;

    const context = gsap.context(() => {
      const sideOffset = () => window.innerWidth * (window.innerWidth <= 700 ? 0.14 : 0.2);
      const fillScale = () => {
        return Math.max(stage.clientWidth / final.offsetWidth, stage.clientHeight / final.offsetHeight) * 1.08;
      };
      const introTime = (time: number) => time * 0.5;

      gsap.set([raw, process, final], { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
      gsap.set(raw, { x: 0, y: 0, rotation: -2, autoAlpha: 1 });
      gsap.set(process, { x: 0, y: "110svh", rotation: 5, scale: 0.94, autoAlpha: 1 });
      gsap.set(final, { x: 0, y: "120svh", rotation: -5, scale: 0.94, autoAlpha: 1 });
      gsap.set(rawCaption, { autoAlpha: 1 });
      gsap.set([processCaption, finalCaption], { autoAlpha: 0 });
      gsap.set(shade, { autoAlpha: 0 });
      gsap.set(reveal, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set(aboutPage, { autoAlpha: 0 });
      gsap.set(aboutMedia, { x: () => -window.innerWidth, autoAlpha: 0 });
      gsap.set(aboutContent, { y: 34, autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top+=76px",
          end: "bottom bottom",
          scrub: 0.12,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              aboutVideo.pause();
            } else if (self.progress >= 0.63 && aboutVideo.paused) {
              void aboutVideo.play().catch(() => undefined);
            } else if (self.progress < 0.63 && !aboutVideo.paused) {
              aboutVideo.pause();
            }
          },
        },
      });

      // Phase 1 (0–40% of the intro): quick, overlapping entries with a short fan-out.
      timeline.to(raw, { x: () => -sideOffset(), y: 10, rotation: -8, duration: introTime(0.1), ease: "power3.out" }, introTime(0.08));
      timeline.to(process, { x: 0, y: 0, rotation: 2, scale: 1, duration: introTime(0.11), ease: "back.out(1.55)" }, introTime(0.1));
      timeline.to(processCaption, { autoAlpha: 1, duration: introTime(0.035), ease: "none" }, introTime(0.195));
      timeline.to(final, { x: () => sideOffset(), y: -8, rotation: 8, scale: 1, duration: introTime(0.11), ease: "back.out(1.55)" }, introTime(0.245));
      timeline.to(finalCaption, { autoAlpha: 1, duration: introTime(0.035), ease: "none" }, introTime(0.34));

      // Phase 2 (40–100% of the intro): fracture the stack and reward the scroll with the headline alone.
      timeline.to(raw, { x: () => -window.innerWidth * 1.1, y: () => window.innerHeight * 1.1, rotation: -20, autoAlpha: 0.2, duration: introTime(0.25), ease: "power3.in" }, introTime(0.4));
      timeline.to(process, { x: () => window.innerWidth * 1.25, y: () => -window.innerHeight * 1.2, rotation: 18, filter: "blur(16px)", autoAlpha: 0, duration: introTime(0.25), ease: "power3.in" }, introTime(0.4));
      timeline.to(final, { x: 0, y: 0, rotation: 0, scale: fillScale, duration: introTime(0.47), ease: "power2.inOut" }, introTime(0.4));
      timeline.to(finalCaption, { autoAlpha: 0, duration: introTime(0.14), ease: "none" }, introTime(0.44));
      timeline.to(shade, { autoAlpha: 1, duration: introTime(0.3), ease: "none" }, introTime(0.49));
      timeline.to(reveal, { autoAlpha: 1, scale: 1, duration: introTime(0.26), ease: "back.out(1.15)" }, introTime(0.72));

      // The next half-scroll lifts and shrinks the title as the actual About layout arrives.
      timeline.to(aboutPage, { autoAlpha: 1, duration: 0.18, ease: "none" }, 0.55);
      timeline.to(headline, {
        y: () => -stage.clientHeight / 2 + 58,
        fontSize: () => window.innerWidth <= 700 ? 26 : 46,
        duration: 0.31,
        ease: "power2.inOut",
      }, 0.53);
      timeline.to(headline, { color: "#10100f", duration: 0.2, ease: "none" }, 0.57);
      timeline.to(headlineAccent, { color: "#10100f", duration: 0.2, ease: "none" }, 0.57);
      timeline.to(aboutMedia, { x: 0, autoAlpha: 1, duration: 0.37, ease: "power3.out" }, 0.63);
      timeline.to(aboutContent, { y: 0, autoAlpha: 1, duration: 0.37, ease: "power2.out" }, 0.63);

      ScrollTrigger.refresh();
    }, section);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const video = sectionRef.current?.querySelector<HTMLVideoElement>(".about-page-media video");
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    video.pause();
    const mobile = window.matchMedia("(max-width: 760px)");
    const observer = mobile.matches && !reducedMotion.matches
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        }, { threshold: 0.35 })
      : null;
    observer?.observe(video);
    const pauseForReducedMotion = () => {
      if (reducedMotion.matches) video.pause();
    };

    reducedMotion.addEventListener("change", pauseForReducedMotion);
    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", pauseForReducedMotion);
    };
  }, []);

  return (
    <section id="the-idea" ref={sectionRef} className="about-intro" aria-labelledby="about-intro-title">
      <div className="about-intro__stage">
        <div className="about-intro__cards" role="group" aria-label="The photo moves from raw image to final frame">
          <article className="about-intro__card about-intro__card--raw">
            <ImageFrame src={introMoment.src} alt={introMoment.alt} className="about-intro__media" imageClassName="about-intro__photo about-intro__photo--raw" sizes="(max-width: 700px) 88vw, 56vw" priority />
            <p className="about-intro__caption about-intro__caption--raw">Bridging the gap...</p>
          </article>

          <article className="about-intro__card about-intro__card--process">
            <ImageFrame src={introMoment.src} alt="" className="about-intro__media" imageClassName="about-intro__photo about-intro__photo--process" sizes="(max-width: 700px) 88vw, 56vw" />
            <div className="about-intro__edit-panel" aria-hidden="true">
              <div className="about-intro__edit-titlebar">
                <span className="about-intro__edit-brand"><i /> STILL / DARKROOM</span>
                <span className="about-intro__edit-filename">friends_001.psd</span>
                <span className="about-intro__edit-window-controls"><i /><i /><i /></span>
              </div>
              <div className="about-intro__edit-workspace">
                <div className="about-intro__edit-tools">
                  <span>⌖</span><span>◩</span><span>⌗</span><span>◉</span><span>✳</span><span>✎</span>
                </div>
                <div className="about-intro__edit-canvas">
                  <ImageFrame src={introMoment.src} alt="" className="about-intro__edit-preview" imageClassName="about-intro__edit-preview-photo" sizes="(max-width: 700px) 40vw, 32vw" />
                  <span className="about-intro__edit-canvas-label">FIT · 68%</span>
                </div>
                <div className="about-intro__edit-controls">
                  <span className="about-intro__edit-heading">ADJUSTMENTS</span>
                  <span className="about-intro__edit-histogram"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                  <span className="about-intro__edit-row"><span>Exposure</span><i><b style={{ width: "62%" }} /></i><strong>+0.3</strong></span>
                  <span className="about-intro__edit-row"><span>Contrast</span><i><b style={{ width: "71%" }} /></i><strong>+12</strong></span>
                  <span className="about-intro__edit-row"><span>Highlights</span><i><b style={{ width: "45%" }} /></i><strong>-08</strong></span>
                  <span className="about-intro__edit-row"><span>Warmth</span><i><b style={{ width: "55%" }} /></i><strong>+4</strong></span>
                  <span className="about-intro__edit-row"><span>Saturation</span><i><b style={{ width: "66%" }} /></i><strong>+9</strong></span>
                  <span className="about-intro__edit-layer"><i /> Color grade <b>ON</b></span>
                </div>
              </div>
            </div>
            <p className="about-intro__caption about-intro__caption--process">...between the initial concept...</p>
          </article>

          <article className="about-intro__card about-intro__card--final">
            <ImageFrame src={introMoment.src} alt="" className="about-intro__media" imageClassName="about-intro__photo about-intro__photo--final" sizes="(max-width: 700px) 88vw, 56vw" />
            <div className="about-intro__shade" aria-hidden="true" />
            <p className="about-intro__caption about-intro__caption--final">...and the final frame.</p>
          </article>
        </div>

        <div className="about-intro__reveal">
          <h2 id="about-intro-title">Your phone wants you to <em>stay.</em></h2>
        </div>

        <div className="about-page-layer" role="region" aria-label="About Still">
          <div className="about-page-shell">
            <figure className="about-page-media">
              <video muted loop playsInline preload="metadata" poster={media.aboutProductPoster} aria-label="A close view of hands adjusting the lens of a film camera.">
              <source src={media.aboutProductVideo} type="video/mp4" />
              </video>
              <figcaption>Just a memory.</figcaption>
            </figure>

            <div className="about-page-content">
              <div className="about-page-intro">
                <p><strong>Still</strong> is a product concept built around a simpler intention: make a photograph, then return to the people and place in front of you.</p>
              </div>
              <p className="about-page-paragraph">“Just one photo” can become a dozen notifications, a little edit, a quick check. The moment slips by while we decide what to do with it.</p>
              <div className="about-page-stats" aria-label="Still's product principles">
                <div><strong>01</strong><span>Purpose-built camera</span></div>
                <div><strong>03</strong><span>Simple steps from moment to memory</span></div>
                <div><strong>0</strong><span>Feeds pulling you away</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
