"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ImageFrame from "@/components/ImageFrame";
import { frameStudies, type FrameStudyKey } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const order: FrameStudyKey[] = ["notice", "keep", "return"];

export default function FrameStudy() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<FrameStudyKey>("notice");

  useGSAP(() => {
    const rootElement = root.current;
    const stage = rootElement?.querySelector<HTMLElement>(".frame-study__stage");
    const scenes = gsap.utils.toArray<HTMLElement>(".frame-study__scene", rootElement);
    if (!rootElement || !stage || scenes.length !== 3) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let currentScene = 0;
      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          id: "frame-study-story",
          trigger: rootElement,
          start: "top top+=76",
          end: "+=210%",
          pin: stage,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const nextIndex = Math.min(2, Math.floor(progress * 3));
            if (nextIndex !== currentScene) {
              currentScene = nextIndex;
              setActive(order[nextIndex]);
            }
          },
        },
      });

      scenes.forEach((scene, index) => {
        const image = scene.querySelector<HTMLElement>(".frame-study__image-photo");
        const viewfinder = scene.querySelector<HTMLElement>(".viewfinder");
        const copy = scene.querySelector<HTMLElement>(".frame-study__copy");
        if (index === 0) {
          gsap.set(scene, { autoAlpha: 1, zIndex: 1 });
          if (image) gsap.set(image, { scale: 1.04 });
        } else {
          gsap.set(scene, { autoAlpha: 0, zIndex: 0 });
          if (image) gsap.set(image, { scale: 1.12 });
        }
        if (viewfinder && index === 0) gsap.set(viewfinder, { scale: 0.92, autoAlpha: 0.7 });
        if (copy) gsap.set(copy, { y: 24, autoAlpha: index === 0 ? 1 : 0 });
      });

      // Each beat gets its own scroll interval. The two short overlaps make
      // the transitions feel like a camera settling on a frame, not a slideshow.
      timeline
        .to(scenes[0].querySelector(".viewfinder"), { scale: 1, autoAlpha: 1, duration: 0.42 }, 0.08)
        .to(scenes[0], { autoAlpha: 0, duration: 0.2 }, 0.84)
        .set(scenes[0], { zIndex: 0 }, 1.04)
        .set(scenes[1], { zIndex: 1 }, 0.84)
        .to(scenes[1], { autoAlpha: 1, duration: 0.22 }, 0.84)
        .to(scenes[1].querySelector(".frame-study__copy"), { y: 0, autoAlpha: 1, duration: 0.26 }, 0.9)
        .to(scenes[0].querySelector(".frame-study__copy"), { y: -18, autoAlpha: 0, duration: 0.18 }, 0.84)
        .to(scenes[1].querySelector(".frame-study__image-photo"), { scale: 1.02, duration: 0.8 }, 0.84)
        .to(scenes[1].querySelector(".frame-study__capture-flash"), { autoAlpha: 0.9, duration: 0.035 }, 1.38)
        .to(scenes[1].querySelector(".frame-study__capture-flash"), { autoAlpha: 0, duration: 0.2 }, 1.42)
        .to(scenes[1], { autoAlpha: 0, duration: 0.2 }, 1.84)
        .set(scenes[1], { zIndex: 0 }, 2.04)
        .set(scenes[2], { zIndex: 1 }, 1.84)
        .to(scenes[2], { autoAlpha: 1, duration: 0.22 }, 1.84)
        .to(scenes[2].querySelector(".frame-study__copy"), { y: 0, autoAlpha: 1, duration: 0.26 }, 1.9)
        .to(scenes[1].querySelector(".frame-study__copy"), { y: -18, autoAlpha: 0, duration: 0.18 }, 1.84)
        .to(scenes[2].querySelector(".frame-study__image-photo"), { scale: 1.02, duration: 0.8 }, 1.84);

      return () => timeline.scrollTrigger?.kill();
    });

    return () => media.revert();
  }, { scope: root, dependencies: [] });

  const goToScene = (index: number) => {
    const trigger = ScrollTrigger.getById("frame-study-story");
    if (!trigger) {
      setActive(order[index]);
      return;
    }
    const position = index === 0 ? 0.08 : index === 1 ? 0.5 : 0.92;
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * position,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className="frame-study" ref={root}>
      <div className="frame-study__stage">
        <div className="frame-study__controls" role="group" aria-label="Explore the three moments">
          {order.map((key, index) => (
            <button
              key={key}
              type="button"
              aria-pressed={active === key}
              aria-controls={`frame-scene-${key}`}
              onClick={() => goToScene(index)}
              className="frame-study__tab"
            >
              <span className="frame-study__tab-number">0{index + 1}</span>{studyLabel(key)}
            </button>
          ))}
        </div>
        <div className="frame-study__scenes" aria-live="polite">
          {order.map((key) => {
            const study = frameStudies[key];
            const isKeep = key === "keep";
            return (
              <article
                className={`frame-study__scene frame-study__scene--${key}`}
                id={`frame-scene-${key}`}
                key={key}
                aria-hidden={active !== key}
                data-active={active === key}
              >
                <div className="frame-study__copy">
                  <p className="eyebrow eyebrow--small">{study.stepLabel}</p>
                  <h3>{study.title}</h3>
                  <p>{study.copy}</p>
                  <span className="frame-study__progress">{study.counter}<i aria-hidden="true" /></span>
                </div>
                <div className="frame-study__image-wrap">
                  <ImageFrame
                    src={study.image.src}
                    alt={study.image.alt}
                    className="frame-study__image"
                    imageClassName="frame-study__image-photo"
                    sizes="(max-width: 760px) 100vw, 58vw"
                  />
                  {key === "notice" && <span className="viewfinder" aria-hidden="true"><i /><i /><i /><i /></span>}
                  {isKeep && <span className="frame-study__capture-flash" aria-hidden="true" />}
                  {isKeep && <EditorPanel />}
                  {!isKeep && <span className="frame-study__image-caption">{study.imageCaption}</span>}
                  {isKeep && <span className="frame-study__capture-label">Frame held <i aria-hidden="true" /></span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EditorPanel() {
  return (
    <div className="editor-panel" aria-label="A camera image being gently developed">
      <div className="editor-panel__top"><span className="editor-panel__mark">STILL / DARKROOM</span><span>EDIT 01</span></div>
      <div className="editor-panel__body">
        <div className="editor-panel__tools" aria-hidden="true"><i>◩</i><i>◉</i><i>⌁</i><i>◌</i><i>⊞</i></div>
        <div className="editor-panel__settings">
          <div className="editor-panel__histogram" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <p><span>Light</span><b>+</b></p><div className="editor-panel__slider"><i /></div>
          <p><span>Contrast</span><b>−</b></p><div className="editor-panel__slider editor-panel__slider--contrast"><i /></div>
          <p><span>Warmth</span><b>+</b></p><div className="editor-panel__slider editor-panel__slider--warmth"><i /></div>
          <p><span>Colour</span><b>+</b></p><div className="editor-panel__slider editor-panel__slider--colour"><i /></div>
        </div>
      </div>
      <div className="editor-panel__footer"><span>ONE FRAME / NO FEED</span><span>✓ SAVED</span></div>
    </div>
  );
}

function studyLabel(key: FrameStudyKey) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}
