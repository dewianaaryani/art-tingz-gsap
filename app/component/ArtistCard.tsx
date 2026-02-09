"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

const images = [
  "https://assets.codepen.io/16327/portrait-number-01.png",
  "https://assets.codepen.io/16327/portrait-number-02.png",
  "https://assets.codepen.io/16327/portrait-number-03.png",
  "https://assets.codepen.io/16327/portrait-number-04.png",
  "https://assets.codepen.io/16327/portrait-number-05.png",
  "https://assets.codepen.io/16327/portrait-number-06.png",
  "https://assets.codepen.io/16327/portrait-number-07.png",
];

export default function ArtistCard() {
  const loopImages = [...images, ...images, ...images];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  const cardWidth = 260;
  const gap = 40;

  useGSAP(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;

    const cardWidth = 260;
    const gap = 40;
    const itemSize = cardWidth + gap;

    const baseLength = images.length; // 7
    const totalItems = baseLength * 3;
    const totalWidth = totalItems * itemSize;

    // Start from middle copy
    const startIndex = baseLength;

    let activeIndex = startIndex;

    const getCenterX = () => window.innerWidth / 2 - cardWidth / 2;

    // Wrap inside middle set
    const wrapX = gsap.utils.wrap(
      -totalWidth + baseLength * itemSize,
      -baseLength * itemSize,
    );

    // Animate scale / opacity
    const animateCards = (centerIndex: number) => {
      const cards = gsap.utils.toArray<HTMLElement>(".artist-card");

      cards.forEach((card, i) => {
        const realIndex = i % baseLength;

        gsap.to(card, {
          scale: realIndex === centerIndex ? 1.15 : 0.85,
          opacity: realIndex === centerIndex ? 1 : 0.5,
          filter:
            realIndex === centerIndex ? "brightness(1)" : "brightness(0.6)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    // Center selected card
    const centerCard = (index: number) => {
      activeIndex = index;

      const centerX = getCenterX();

      let targetX = centerX - index * itemSize;

      targetX = wrapX(targetX);

      gsap.to(track, {
        x: targetX,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });

      const normalized = ((index % baseLength) + baseLength) % baseLength;

      animateCards(normalized);
      setActive(normalized);
    };

    // Get active index from position
    const getIndex = () => {
      const x = gsap.getProperty(track, "x") as number;

      const centerX = getCenterX();

      const raw = Math.round((centerX - x) / itemSize);

      return raw;
    };

    // Create draggable
    const draggable = Draggable.create(track, {
      type: "x",
      inertia: true,

      onDrag() {
        gsap.set(track, {
          x: wrapX(this.x),
        });

        centerCard(getIndex());
      },

      onThrowUpdate() {
        gsap.set(track, {
          x: wrapX(this.x),
        });

        centerCard(getIndex());
      },

      onRelease() {
        centerCard(getIndex());
      },

      onThrowComplete() {
        centerCard(getIndex());
      },
    })[0];

    // Handle resize
    const handleResize = () => {
      centerCard(activeIndex);
    };

    window.addEventListener("resize", handleResize);

    // Init position
    gsap.set(track, {
      x: getCenterX() - startIndex * itemSize,
    });

    centerCard(startIndex);

    // Cleanup
    return () => {
      draggable.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Title */}
      <h2 className="text-white text-3xl tracking-widest mb-12">THE ARTIST</h2>

      {/* Wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full h-[420px] overflow-hidden"
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center absolute top-1/2 -translate-y-1/2"
          style={{ gap: `${gap}px` }}
        >
          {loopImages.map((img, i) => (
            <div
              key={i}
              className="artist-card relative flex-shrink-0"
              style={{
                width: cardWidth,
                height: 340,
              }}
            >
              {/* Image */}
              <img
                src={img}
                alt="artist"
                className="w-full h-full object-cover rounded-lg"
                draggable={false}
              />

              {/* Name */}
              {active === i && (
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <p className="text-white text-lg font-semibold tracking-wide">
                    PHIDIAS OF ATHENS
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
