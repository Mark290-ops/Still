"use client";

import { useEffect, useRef, useState } from "react";
import ImageFrame from "@/components/ImageFrame";

type CameraHeroMediaProps = {
  src?: string;
  poster: string;
  alt: string;
  posterAlt: string;
};

export default function CameraHeroMedia({ src, poster, alt, posterAlt }: CameraHeroMediaProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (reducedMotion.matches) {
        video.pause();
      } else {
        void video.play().catch(() => setFailed(true));
      }
    };

    syncPlayback();
    reducedMotion.addEventListener("change", syncPlayback);
    return () => reducedMotion.removeEventListener("change", syncPlayback);
  }, [src]);

  if (!src || failed) {
    return (
      <ImageFrame
        src={poster}
        alt={posterAlt}
        className="hero__image"
        imageClassName="hero__image-photo"
        sizes="(max-width: 760px) 100vw, 90vw"
        priority
      />
    );
  }

  return (
    <div className="camera-hero-media" data-media-state={ready ? "ready" : "loading"}>
      <span className="image-frame__skeleton" aria-hidden="true" />
      <video
        ref={videoRef}
        className="camera-hero-media__video"
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={alt}
        onCanPlay={() => setReady(true)}
        onError={() => setFailed(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
