"use client";

import { images } from "@/constant";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, Flip);

const StatueGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
  useGSAP(
    () => {
      const gallery = containerRef.current?.querySelector(".gallery");
      if (!gallery) return;

      const items = gallery.querySelectorAll(".gallery__item");

      // Capture final state
      gallery.classList.remove("gallery--final");
      gallery.classList.add("gallery--final");
      const state = Flip.getState(items);
      gallery.classList.remove("gallery--final");
      // Animate
      const flip = Flip.to(state, {
        simple: true,
        ease: "expoScale(0.5, 2)",
        scale: true, // 🔥 important
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: gallery,
            start: "center center",
            end: "+=150%",
            scrub: true,
            pin: gallery.parentElement,
          },
        })
        .add(flip);
      //   return () => gsap.set(items, { clearProps: "all" });
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
              className="gallery__item bg-center bg-cover flex-none relative"
              style={{ gridArea: areas[i] }}
            >
              <img
                src={img.src}
                className={`w-full h-full object-cover ${img.position}`}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatueGrid;
