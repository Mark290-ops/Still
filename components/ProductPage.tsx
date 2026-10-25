"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const gardenVideo = "https://videos.pexels.com/video-files/36906452/15634016_1920_1080_30fps.mp4";
const gardenStill = "https://images.pexels.com/videos/36906452/pexels-photo-36906452.jpeg?auto=compress&cs=tinysrgb&w=2200";
const liveSceneVideo = "https://videos.pexels.com/video-files/8774197/8774197-uhd_3840_2160_25fps.mp4";
const editFilters = [
  { id: "natural", label: "Natural" },
  { id: "warm", label: "Warm" },
  { id: "mono", label: "Mono" },
  { id: "soft", label: "Soft" },
] as const;
type EditFilter = typeof editFilters[number]["id"];
const frames = [
  {
    src: "https://images.unsplash.com/photo-1758275557233-773c6c03614e?auto=format&fit=crop&w=1200&q=90",
    alt: "Friends sharing a relaxed picnic in the sun, gathered close in a park.",
    label: "01 / FOCAL TIME",
    title: "Stay with the scene.",
    copy: "Let the light settle. Find one detail worth keeping before the moment moves on.",
  },
  {
    src: "https://images.unsplash.com/photo-1758275557315-53f66f57119a?auto=format&fit=crop&w=1200&q=90",
    alt: "A group of friends smiling and waving together outdoors.",
    label: "02 / KEEP A FRAME",
    title: "Keep them as they are.",
    copy: "A familiar face, a shared joke, the feeling of being there together.",
  },
  {
    src: "https://images.unsplash.com/photo-1768244016470-271b210a8407?auto=format&fit=crop&w=1200&q=90",
    alt: "Three friends embracing outdoors in a warm candid moment.",
    label: "03 / RETURN TO LIFE",
    title: "Then return to the day.",
    copy: "The photograph is yours to revisit. The rest of the afternoon stays present.",
  },
];

export default function ProductPage() {
  const root = useRef<HTMLElement>(null);
  const [liveOpen, setLiveOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [exposure, setExposure] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<EditFilter>("natural");
  const [focus, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [editedSnapshot, setEditedSnapshot] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraSceneVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!liveOpen || snapshot) return;

    const video = cameraSceneVideo.current;
    if (!video) return;
    let ready = false;
    const markReady = () => {
      if (!ready && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        ready = true;
        setCameraReady(true);
      }
    };
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    markReady();
    video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.pause();
    };
  }, [liveOpen, snapshot]);

  useEffect(() => {
    if (!snapshot) {
      setEditedSnapshot(null);
      return;
    }

    setEditedSnapshot(null);
    let cancelled = false;
    const photo = new Image();
    photo.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1440;
      canvas.height = Math.round(canvas.width * photo.naturalHeight / photo.naturalWidth);
      const context = canvas.getContext("2d");
      if (!context) {
        setEditedSnapshot(snapshot);
        return;
      }

      const cropWidth = photo.naturalWidth / zoom;
      const cropHeight = photo.naturalHeight / zoom;
      const sx = (photo.naturalWidth - cropWidth) / 2;
      const sy = (photo.naturalHeight - cropHeight) / 2;
      const brightness = Math.max(0.55, 1 + exposure * 0.09);
      const saturation = Math.max(0.4, 1 + warmth * 0.05);
      const sepia = Math.max(0, warmth * 0.035);
      const filters: Record<EditFilter, string> = {
        natural: `brightness(${brightness}) saturate(${saturation}) sepia(${sepia})`,
        warm: `brightness(${brightness}) saturate(${Math.max(0.5, saturation + 0.15)}) sepia(${Math.max(0.2, sepia + 0.2)})`,
        mono: `brightness(${brightness}) grayscale(1) contrast(1.08)`,
        soft: `brightness(${brightness}) saturate(${Math.max(0.45, saturation - 0.18)}) contrast(0.92) sepia(0.06)`,
      };
      context.filter = filters[selectedFilter];
      context.drawImage(photo, sx, sy, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      try {
        setEditedSnapshot(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
        setEditedSnapshot(snapshot);
      }
    };
    photo.onerror = () => {
      if (!cancelled) setEditedSnapshot(snapshot);
    };
    photo.src = snapshot;
    return () => {
      cancelled = true;
      photo.onload = null;
      photo.onerror = null;
    };
  }, [snapshot, zoom, exposure, warmth, selectedFilter]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 760) {
      const wordSection = root.current?.querySelector<HTMLElement>(".product-words");
      const wordStage = root.current?.querySelector<HTMLElement>(".product-words__stage");
      const words = Array.from(root.current?.querySelectorAll<HTMLElement>(".product-words__line") ?? []);

      if (wordSection && wordStage && words.length === 3) {
        gsap.set(words, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
        gsap.set(words[0], { autoAlpha: 1 });

        const mobileIntro = gsap.timeline({
          scrollTrigger: {
            trigger: wordSection,
            start: "top top+=64px",
            end: () => `+=${Math.round(window.innerHeight * 0.72)}`,
            scrub: 0.5,
            pin: wordStage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        mobileIntro.to(words[0], { x: "-110vw", autoAlpha: 0, duration: 0.24, ease: "power4.in" }, 0.22)
          .fromTo(words[1], { x: "110vw", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.28, ease: "expo.out", immediateRender: false }, 0.26)
          .to(words[1], { y: "100vh", autoAlpha: 0, duration: 0.24, ease: "power4.in" }, 0.61)
          .fromTo(words[2], { y: "-80vh", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "expo.out", immediateRender: false }, 0.65)
          .to(words[2], { scale: 1.08, autoAlpha: 0, duration: 0.24, ease: "power3.in" }, 1.08);
      }

      gsap.set(".product-story__lens-study-wrap", { autoAlpha: 0, x: "6vw", y: "1vh", scale: 0.94 });
      gsap.fromTo(".product-story__lens-study-wrap", { x: "6vw", y: "1vh", scale: 0.94, autoAlpha: 0 }, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-story__stage",
          start: "top 78%",
          end: "top 38%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
      return;
    }
    const syncHeadlineOverlay = () => {
      const stage = root.current?.querySelector<HTMLElement>(".product-story__stage");
      const camera = root.current?.querySelector<HTMLElement>(".product-story__camera-frame");
      if (!stage || !camera) return;

      const stageRect = stage.getBoundingClientRect();
      const cameraRect = camera.getBoundingClientRect();
      const syncOverlay = (source: HTMLElement | null | undefined, overlay: HTMLElement | null | undefined) => {
        if (!source || !overlay) return;
        const sourceRect = source.getBoundingClientRect();
        const left = Math.max(sourceRect.left, cameraRect.left);
        const top = Math.max(sourceRect.top, cameraRect.top);
        const right = Math.min(sourceRect.right, cameraRect.right);
        const bottom = Math.min(sourceRect.bottom, cameraRect.bottom);

        gsap.set(overlay, {
          left: sourceRect.left - stageRect.left,
          top: sourceRect.top - stageRect.top,
          width: sourceRect.width,
          height: sourceRect.height,
        });
        overlay.style.clipPath = right <= left || bottom <= top
          ? "inset(50%)"
          : `inset(${top - sourceRect.top}px ${sourceRect.right - right}px ${sourceRect.bottom - bottom}px ${left - sourceRect.left}px)`;
      };

      syncOverlay(
        root.current?.querySelector<HTMLElement>("#product-story-title"),
        root.current?.querySelector<HTMLElement>(".product-story__headline-light"),
      );
      syncOverlay(
        root.current?.querySelector<HTMLElement>("#product-story-lower-title"),
        root.current?.querySelector<HTMLElement>(".product-story__detail-title-light"),
      );
    };

    const words = gsap.utils.toArray<HTMLElement>(".product-words__line");
    gsap.set(words[0], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsap.set(words[1], { autoAlpha: 0, x: "115vw", y: 0, scale: 0.96 });
    gsap.set(words[2], { autoAlpha: 0, x: 0, y: "-115vh", scale: 0.96 });
    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: ".product-words",
        start: "top top+=76px",
        end: "+=360%",
        scrub: 0.45,
        pin: ".product-words__stage",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    intro.to(words[0], { x: "-120vw", autoAlpha: 0, duration: 0.58, ease: "power4.in" }, 0.9)
      .fromTo(words[1], { x: "120vw", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.58, ease: "expo.out", immediateRender: false }, 0.94)
      .to(words[1], { y: "120vh", autoAlpha: 0, duration: 0.58, ease: "power4.in" }, 2.28)
      .fromTo(words[2], { y: "-120vh", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, ease: "expo.out", immediateRender: false }, 2.32)
      .to(words[2], { scale: 1.2, autoAlpha: 0, duration: 0.68, ease: "power3.in" }, 4.45);

    gsap.set(".product-story__lens-study-wrap", { autoAlpha: 0, x: "6vw", y: "1vh", scale: 0.94 });
    const story = gsap.timeline({
      onUpdate: syncHeadlineOverlay,
      scrollTrigger: {
        trigger: ".product-story",
        start: "top top+=76px",
        end: "+=125%",
        scrub: 0.65,
        pin: ".product-story__stage",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: syncHeadlineOverlay,
      },
    });
    story.to(".product-story__camera-frame", {
      width: () => `${Math.min(window.innerWidth * 0.48, 1080)}px`,
      height: () => `${Math.min(window.innerWidth * 0.48, 1080) * (9 / 16) + 72}px`,
      top: "51%",
      ease: "power3.inOut",
      duration: 1,
    }, 0.05)
      .fromTo(".product-story__detail--left", { x: "-30vw", y: "-6vh", autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.72, immediateRender: false }, 0.48)
      .fromTo(".product-story__detail--right", { x: "30vw", y: "-4vh", autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.72, immediateRender: false }, 0.58)
      .fromTo(".product-story__detail--lower", { x: "18vw", y: "20vh", autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.72, immediateRender: false }, 0.7)
      .fromTo(".product-story__lens-study-wrap", { x: "6vw", y: "1vh", scale: 0.94, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, autoAlpha: 1, ease: "power3.out", duration: 0.64, immediateRender: false }, 0.76);
    ScrollTrigger.refresh();
    syncHeadlineOverlay();
  }, { scope: root, dependencies: [] });

  function handleFocus(event: PointerEvent<HTMLDivElement>) {
    if (snapshot) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setFocusPoint({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  }

  function takeSnapshot() {
    const video = cameraSceneVideo.current;
    if (!cameraReady || !video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    const screen = video.closest<HTMLElement>(".live-feed__screen");
    const targetWidth = 1440;
    const targetRatio = screen && screen.clientHeight > 0 ? screen.clientWidth / screen.clientHeight : 1.936;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = Math.round(targetWidth / targetRatio);
    const context = canvas.getContext("2d");
    if (!context) return;
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    const sourceRatio = sourceWidth / sourceHeight;
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;
    if (sourceRatio > targetRatio) cropWidth = sourceHeight * targetRatio;
    else cropHeight = sourceWidth / targetRatio;
    const sx = (sourceWidth - cropWidth) / 2;
    const sy = (sourceHeight - cropHeight) / 2;
    context.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    try {
      setSnapshot(canvas.toDataURL("image/jpeg", 0.92));
    } catch {
      setCameraReady(false);
    }
  }

  function resetPrototype() {
    setSnapshot(null);
    setCameraReady(false);
    setZoom(1);
    setExposure(0);
    setWarmth(0);
    setSelectedFilter("natural");
    setFocusPoint(null);
    setEditedSnapshot(null);
  }

  return (
    <section id="the-moment" className="product-page" ref={root} aria-label="The Still product experience">
      <div className="product-words" aria-label="Look. Frame. Let it be.">
        <div className="product-words__stage">
          <p className="product-words__eyebrow">A quieter way to photograph</p>
          <h2 className="product-page__sr-only">Look. Frame. Let it be.</h2>
          <div className="product-words__viewport" aria-hidden="true">
            <span className="product-words__line">Look.</span>
            <span className="product-words__line">Frame.</span>
            <span className="product-words__line">Let it be.</span>
          </div>
          <span className="product-words__scroll">SCROLL TO ENTER <i aria-hidden="true">↓</i></span>
        </div>
      </div>

      <section className="product-story" aria-labelledby="product-story-title">
        <div className="product-story__stage">
          <header className="product-story__intro">
            <p className="product-eyebrow">THE STILL CAMERA / IN THE MOMENT</p>
            <div className="product-story__headline">
              <h2 id="product-story-title">Keep the feeling<br />of being there.</h2>
            </div>
          </header>
          <div className="product-story__lens-study-wrap">
            <figure className="product-story__lens-study">
              <img src="/media/product-lens-breakdown-white.jpg" alt="A labeled exploded view of the camera lens, its glass elements, inner housing, aperture, and mount ring." />
            </figure>
            <p className="product-story__lens-caption">“One clear view, then the small details that make the moment yours.”</p>
          </div>
          <h2 className="product-story__headline-light" aria-hidden="true">Keep the feeling<br />of being there.</h2>
          <div className="product-story__camera-frame" aria-label="Camera viewfinder showing a sunlit garden">
            <div className="product-camera__topbar"><span className="product-camera__battery">▰ <i>↯</i></span><span>STILL / LIVE VIEW</span><span>10:08 <b>▰</b></span></div>
            <div className="product-camera__viewport">
              <video src={gardenVideo} poster={gardenStill} autoPlay muted loop playsInline preload="metadata" aria-label="A sunlit garden pathway surrounded by lush green leaves." />
              <span className="product-camera__focus" aria-hidden="true"><i /></span>
              <span className="product-camera__scene-label">A GARDEN PATH, IN LIGHT</span>
              <span className="product-camera__rec"><i /> REC</span>
            </div>
            <div className="product-camera__bottom-bar"><span>ISO 100</span><span>1/125</span><span>F 2.8</span><span>EV 0.0</span><span className="product-camera__meter"><i /></span><span>WB AUTO</span></div>
            <span className="product-camera__registration" aria-hidden="true"><i /><i /><i /><i /></span>
          </div>
          <article className="product-story__detail product-story__detail--left">
            <img src={frames[0].src} alt={frames[0].alt} />
            <div><span>{frames[0].label}</span><h3>{frames[0].title}</h3><p>{frames[0].copy}</p></div>
          </article>
          <article className="product-story__detail product-story__detail--right">
            <img src={frames[1].src} alt={frames[1].alt} />
            <div><span>{frames[1].label}</span><h3>{frames[1].title}</h3><p>{frames[1].copy}</p></div>
          </article>
          <article className="product-story__detail product-story__detail--lower">
            <img src={frames[2].src} alt={frames[2].alt} />
            <div><span>{frames[2].label}</span><h3 id="product-story-lower-title">{frames[2].title}</h3><p>{frames[2].copy}</p></div>
          </article>
          <h3 className="product-story__detail-title-light" aria-hidden="true">{frames[2].title}</h3>
          <p className="product-story__side-index">A small camera for a fuller life <span>01—03</span></p>
          <p className="product-story__prompt">A moment, seen from another angle <span>↗</span></p>
        </div>
      </section>

      <section className="product-live" aria-labelledby="product-live-title">
        <div className="product-live__heading">
          <h2 id="product-live-title">Take your time.<br /><em>Try the view.</em></h2>
          <p>A quiet camera interface, made tangible. Choose a point of focus, tune the light, and keep a frame for yourself.</p>
        </div>
        <button className="product-live__cta" type="button" onClick={() => { if (liveOpen) resetPrototype(); setLiveOpen((open) => !open); }} aria-expanded={liveOpen} aria-controls="live-feed">
          <span>{liveOpen ? "Close live feed" : "Test the live feed"}</span><b aria-hidden="true">{liveOpen ? "−" : "↗"}</b>
        </button>

        {liveOpen && <div className="live-feed" id="live-feed">
          <div className="live-feed__topline"><button type="button" onClick={() => { setLiveOpen(false); resetPrototype(); }}>CANCEL <b aria-hidden="true">×</b></button></div>
          <div className={`live-feed__body ${snapshot ? "live-feed__body--review" : "live-feed__body--camera"}`}>
            <div className={`live-feed__screen${snapshot ? " live-feed__screen--captured" : ""}`} onPointerDown={snapshot ? undefined : handleFocus} role={snapshot ? undefined : "button"} tabIndex={snapshot ? undefined : 0} aria-label={snapshot ? "Captured photograph preview" : "Tap the view to set focus"} onKeyDown={snapshot ? undefined : (event) => { if (event.key === "Enter" || event.key === " ") setFocusPoint({ x: 50, y: 50 }); }}>
              {snapshot ? <img className="live-feed__snapshot" src={editedSnapshot ?? snapshot} alt="Your captured photograph, ready to review." /> : <>
                <video ref={cameraSceneVideo} className="live-feed__motion" src={liveSceneVideo} crossOrigin="anonymous" autoPlay muted loop playsInline preload="auto" aria-label="A group of friends walking and laughing together in a sunny park." />
                <span className="live-feed__corners" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="live-feed__viewfinder-status"><span><i /> REC</span><span>10:08 <b>▰</b></span></span>
                {focus && <span className="live-feed__focus" style={{ left: `${focus.x}%`, top: `${focus.y}%` }} />}
                <span className="live-feed__viewfinder-metadata"><span>ISO 400</span><span>1/125</span><span>F 1.8</span><span>EV {exposure > 0 ? "+" : ""}{exposure.toFixed(1)}</span><span>AF / SINGLE</span></span>
                {!cameraReady && <span className="live-feed__loading">FINDING THE SCENE</span>}
              </>}
              {snapshot && <span className="live-feed__captured-label">PHOTO / 001</span>}
            </div>
            {snapshot && <aside className="live-feed__controls" aria-label="Photo settings and filters">
              <div className="live-feed__control-heading"><span>PHOTO SETTINGS</span><span>EDIT FRAME</span></div>
              <div className="live-feed__filters">
                <p>Choose a filter</p>
                <div>{editFilters.map((option) => <button key={option.id} className={selectedFilter === option.id ? "live-feed__filter live-feed__filter--selected" : "live-feed__filter"} type="button" aria-pressed={selectedFilter === option.id} onClick={() => { setEditedSnapshot(null); setSelectedFilter(option.id); }}><i className={`live-feed__filter-swatch live-feed__filter-swatch--${option.id}`} aria-hidden="true" /><span>{option.label}</span></button>)}</div>
              </div>
              <label><span>Zoom <b>{zoom.toFixed(1)}×</b></span><input type="range" min="1" max="2.4" step="0.1" value={zoom} onChange={(event) => { setEditedSnapshot(null); setZoom(Number(event.target.value)); }} /></label>
              <label><span>Exposure <b>{exposure > 0 ? "+" : ""}{exposure.toFixed(1)} EV</b></span><input type="range" min="-2" max="2" step="0.1" value={exposure} onChange={(event) => { setEditedSnapshot(null); setExposure(Number(event.target.value)); }} /></label>
              <label><span>Warmth <b>{warmth > 0 ? "+" : ""}{warmth}</b></span><input type="range" min="-5" max="5" step="1" value={warmth} onChange={(event) => { setEditedSnapshot(null); setWarmth(Number(event.target.value)); }} /></label>
              <div className="live-feed__actions"><a href={editedSnapshot ?? snapshot} aria-disabled={!editedSnapshot} onClick={(event) => { if (!editedSnapshot) event.preventDefault(); }} download="still-camera-frame.jpg">Save photograph <span>↓</span></a><button type="button" onClick={resetPrototype}>Retake photo <span>↺</span></button></div>
            </aside>}
            {!snapshot && <aside className="live-feed__controls live-feed__camera-controls" aria-label="Camera controls">
              <div className="live-feed__control-heading"><span>CAMERA CONTROLS</span><span>LIVE VIEW</span></div>
              <div className="live-feed__camera-prompt"><b>Choose your focus.</b><p>Tap anywhere in the scene, then take a photograph when the moment feels right.</p></div>
              <div className="live-feed__camera-ready"><span>STILL / 01</span></div>
              <button className="live-feed__shutter" type="button" onClick={takeSnapshot} disabled={!cameraReady}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h3l1.4-2h7.2l1.4 2h3A1.5 1.5 0 0 1 21.5 10v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" /><circle cx="12" cy="13.5" r="3.6" /></svg><span>Take a photograph</span></button>
            </aside>}
          </div>
          <div className="live-feed__footer"><span>PROTOTYPE MODE</span><span>Nothing is uploaded or shared.</span><span>STILL / 01</span></div>
        </div>}
      </section>
    </section>
  );
}
