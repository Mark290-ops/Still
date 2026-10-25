"use client";

import Image from "next/image";
import { useState } from "react";

type ImageFrameProps = {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
};

export default function ImageFrame({
  src,
  alt,
  className,
  imageClassName = "",
  sizes,
  priority = false,
}: ImageFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className={`image-frame ${className}`} data-image-state={failed ? "error" : loaded ? "ready" : "loading"}>
      <span className="image-frame__skeleton" aria-hidden="true" />
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`image-frame__photo ${imageClassName}`}
        />
      )}
    </span>
  );
}
