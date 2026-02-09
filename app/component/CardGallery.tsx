"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";

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

export default function CardGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  const cardWidth = 260;
  const gap = 40;

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalWidth = images.length * (cardWidth + gap);

    gsap.set(track, {
      width: totalWidth,
      x: window.innerWidth / 2 - cardWidth / 2,
    });

    const updateActive = () => {
      const x = gsap.getProperty(track, "x") as number;

      const center = window.innerWidth / 2 - cardWidth / 2 - x;

      const index = Math.round(center / (cardWidth + gap));

      const clamped = Math.max(0, Math.min(images.length - 1, index));

      setActive(clamped);
      animateCards(clamped);
    };

    const animateCards = (centerIndex: number) => {
      const cards = gsap.utils.toArray<HTMLElement>(".artist-card");

      cards.forEach((card, i) => {
        if (i === centerIndex) {
          gsap.to(card, {
            scale: 1.15,
            opacity: 1,
            filter: "brightness(1)",
            duration: 0.4,
            ease: "power3.out",
          });
        } else {
          gsap.to(card, {
            scale: 0.85,
            opacity: 0.5,
            filter: "brightness(0.6)",
            duration: 0.4,
            ease: "power3.out",
          });
        }
      });
    };

    Draggable.create(track, {
      type: "x",
      bounds: {
        minX:
          window.innerWidth / 2 -
          cardWidth / 2 -
          (images.length - 1) * (cardWidth + gap),
        maxX: window.innerWidth / 2 - cardWidth / 2,
      },
      inertia: true,
      onDrag: updateActive,
      onThrowUpdate: updateActive,
      snap: (value) => {
        return Math.round(value / (cardWidth + gap)) * (cardWidth + gap);
      },
    });

    animateCards(0);

    return () => {
      Draggable.get(track)?.kill();
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
          {images.map((img, i) => (
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
