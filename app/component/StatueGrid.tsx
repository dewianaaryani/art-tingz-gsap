"use client";

import { images } from "@/constant";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, Flip);

const areas = [
  "1 / 1 / 3 / 2",
  "1 / 2 / 2 / 3",
  "2 / 2 / 4 / 3",
  "1 / 3 / 3 / 3",
  "3 / 1 / 3 / 2",
  "3 / 3 / 5 / 4",
  "4 / 1 / 5 / 2",
  "4 / 2 / 5 / 3",
];

const StatueGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const gallery = containerRef.current?.querySelector(".gallery");
      if (!gallery) return;

      const items = gallery.querySelectorAll<HTMLElement>(".gallery__item");

      // FIX 1: Promote all items to their own GPU layer BEFORE Flip runs.
      // Without this, the browser promotes them mid-animation causing jank.
      gsap.set(items, { force3D: true, willChange: "transform" });

      // Capture the FINAL state (with bento layout applied)
      gallery.classList.add("gallery--final");
      const finalState = Flip.getState(items);
      gallery.classList.remove("gallery--final");

      // FIX 2: Build Flip animation with performance flags
      const flip = Flip.to(finalState, {
        duration: 1,
        ease: "none", // MUST be "none" for scrub — any other ease fights the scrub
        simple: true, // skips unnecessary property checks
        scale: true, // uses scaleX/scaleY instead of width/height (GPU-friendly)
        absoluteOnLeave: false,
      });

      // FIX 3: scrub: 1 adds smoothing so fast scroll feels weighted not janky
      // invalidateOnRefresh: true recalculates positions if window resizes
      gsap
        .timeline({
          scrollTrigger: {
            trigger: gallery.parentElement,
            start: "center center",
            end: "+=150%",
            scrub: 1,
            pin: gallery.parentElement,
            anticipatePin: 1, // pre-calculates pin to avoid jump on entry
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        })
        .add(flip);

      // FIX 4: Free GPU memory once scroll animation is done
      ScrollTrigger.addEventListener("scrollEnd", () => {
        gsap.set(items, { willChange: "auto" });
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} id="statue-grid">
      <div className="gallery-wrap">
        <div
          className="
            gallery gallery--bento
            grid
            gap-[1vh]
            grid-cols-[repeat(3,32.5vw)]
            grid-rows-[repeat(4,23vh)]
            justify-center content-center
          "
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery__item bg-center bg-cover flex-none relative overflow-hidden"
              style={{
                gridArea: areas[i],
                // translateZ(0) promotes to GPU layer before JS even runs
                transform: "translateZ(0)",
              }}
            >
              <img
                src={img.src}
                className={`w-full h-full object-cover ${img.position}`}
                alt=""
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatueGrid;
