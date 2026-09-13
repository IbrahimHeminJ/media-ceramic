import React, { useEffect, useState } from 'react';

// Every image dropped into src/assets/slides/ is picked up automatically at build
// time — adding or removing a slide never requires touching this component.
const slideModules = import.meta.glob('../assets/slides/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const SLIDES = Object.keys(slideModules)
  .sort()
  .map((key) => slideModules[key]);

const SLIDE_DURATION_MS = 6000;
const TRANSITION_MS = 1500;

/**
 * Full-bleed, auto-advancing background slideshow for the homepage hero.
 * Crossfades between slides with a slow "Ken Burns" zoom, pauses on hover and
 * for users who prefer reduced motion, and degrades gracefully to a single
 * static image (or nothing) when there's only one slide or none at all.
 */
export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (SLIDES.length <= 1 || isPaused || prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  if (SLIDES.length === 0) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${
            i === activeIndex ? 'opacity-100 animate-hero-slide-zoom' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        />
      ))}

      {/* Warm scrim so the slogan stays legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#231D18]/85 via-[#3D3229]/50 to-[#3D3229]/30" />

      {/* Slide indicators */}
      {SLIDES.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
