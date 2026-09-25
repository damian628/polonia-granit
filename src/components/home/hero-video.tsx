'use client';

import { useEffect, useState } from 'react';

const desktopQuery = '(min-width: 768px)';
const reduceMotionQuery = '(prefers-reduced-motion: reduce)';

function shouldPlayVideo() {
  return (
    window.matchMedia(desktopQuery).matches &&
    !window.matchMedia(reduceMotionQuery).matches
  );
}

export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(desktopQuery);
    const reduceMotion = window.matchMedia(reduceMotionQuery);
    const update = () => setEnabled(shouldPlayVideo());

    update();
    desktop.addEventListener('change', update);
    reduceMotion.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduceMotion.removeEventListener('change', update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <video
      className="hero-video absolute inset-0 h-full w-full max-w-none object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/video/hero-drone.jpg"
    >
      <source src="/video/hero-drone.mp4" type="video/mp4" />
    </video>
  );
}
