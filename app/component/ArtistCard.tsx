"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { artistImages } from "@/constant";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(Draggable, ScrollTrigger);

export default function ArtistCard() {
  const [activeReal, setActiveReal] = useState(0);

  const COPIES = 5;

  const loopImages = Array.from({ length: COPIES }, () => artistImages).flat();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const wrapper = wrapperRef.current;

    const cards = gsap.utils.toArray<HTMLElement>(
      track.querySelectorAll(".artist-card"),
    );

    if (!cards.length) return;

    const baseLength = artistImages.length;
    const totalCards = cards.length; // COPIES * baseLength

    let itemSize = 0;
    let totalWidth = 0;
    let draggableInstance: Draggable | null = null;

    // This is the single source of truth for which absolute index is active.
    // We never clamp it — we let it grow/shrink freely and use it directly.
    let currentIndex = 0;

    /* ------------------ Helpers ------------------ */
    // ===== NAME ANIMATION (SMOOTH) =====
    const animateName = () => {
      const nameEl = document.querySelector(".artist-name");
      if (!nameEl) return;

      gsap.killTweensOf(nameEl); // prevent stacking

      gsap.fromTo(
        nameEl,
        {
          y: 12,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    };

    const getItemSize = () => {
      const first = cards[0];
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      return first.offsetWidth + gap;
    };

    const getCenterX = () => {
      return wrapper.offsetWidth / 2 - cards[0].offsetWidth / 2;
    };

    const build = () => {
      itemSize = getItemSize();
      totalWidth = totalCards * itemSize;
    };

    // Convert an absolute index to the x position that centers it
    const indexToX = (index: number) => getCenterX() - index * itemSize;

    // Convert current track x to the nearest absolute index
    const xToIndex = (x: number) => Math.round((getCenterX() - x) / itemSize);

    const animateCards = (centerIndex: number) => {
      cards.forEach((card, i) => {
        const dist = Math.abs(i - centerIndex);
        gsap.to(card, {
          scale: dist === 0 ? 1.15 : 0.85,
          opacity: dist === 0 ? 1 : 0.5,
          filter: dist === 0 ? "brightness(1)" : "brightness(0.6)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    // After snapping, if currentIndex has gone past the edges of our
    // duplicated array, silently jump back to the equivalent position
    // in the middle copy so we never run out of cards.
    const normalizeIndex = () => {
      if (!draggableInstance) return;

      const minIndex = baseLength; // 1 copy from left edge
      const maxIndex = totalCards - baseLength - 1; // 1 copy from right edge

      if (currentIndex < minIndex || currentIndex > maxIndex) {
        // Find the equivalent index in the middle of the array
        const normalizedIndex =
          baseLength * Math.floor(COPIES / 2) +
          (((currentIndex % baseLength) + baseLength) % baseLength);

        currentIndex = normalizedIndex;

        // Teleport track to new x (visually identical, just different absolute position)
        gsap.set(track, { x: indexToX(currentIndex) });
        draggableInstance.update();

        // Re-highlight with the new index
        animateCards(currentIndex);
      }
    };

    const centerCard = (index: number) => {
      currentIndex = index;

      gsap.to(track, {
        x: indexToX(currentIndex),
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
        onComplete: normalizeIndex,
      });

      animateCards(currentIndex);

      const normalized =
        ((currentIndex % baseLength) + baseLength) % baseLength;
      setActive(normalized);
      setActiveReal(currentIndex);

      requestAnimationFrame(() => {
        animateName();
      });
    };

    /* ------------------ Init ------------------ */

    const waitImages = Promise.all(
      cards.map(
        (c) =>
          new Promise((res) => {
            const img = c.querySelector("img");
            if (!img || img.complete) return res(null);
            img.onload = () => res(null);
          }),
      ),
    );
    // ===== ENTRY ANIMATION =====
    gsap.set("#artists", {
      opacity: 0,
      y: 120,
    });

    gsap.set(cards, {
      scale: 0.85,
      opacity: 0,
      filter: "blur(3px)", // was 8px
    });

    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#artists",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    introTl
      .to("#artists", {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out",
      })
      .to(
        cards,
        {
          opacity: 0.5,
          scale: 0.85,
          filter: "brightness(0.6) blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.6",
      );

    waitImages.then(() => {
      introTl?.eventCallback("onComplete", () => {
        build();

        // Start in the middle copy
        const startIndex = baseLength * Math.floor(COPIES / 2);
        currentIndex = startIndex;

        gsap.set(track, { x: indexToX(startIndex) });
        // First highlight (after intro)
        gsap.delayedCall(0.4, () => {
          centerCard(startIndex);
        });

        /* ------------------ Draggable ------------------ */
        const [draggable] = Draggable.create(track, {
          type: "x",
          inertia: true,

          onRelease() {
            // Use this.x (Draggable's own tracked x) for accuracy on release
            centerCard(xToIndex(this.x));
          },

          onThrowComplete() {
            centerCard(xToIndex(gsap.getProperty(track, "x") as number));
          },
        });

        draggableInstance = draggable;
      });

      /* ------------------ Resize ------------------ */
      const resize = () => {
        build();
        gsap.set(track, { x: indexToX(currentIndex) });
        animateCards(currentIndex);
        draggableInstance?.update();
      };

      window.addEventListener("resize", resize);

      return () => {
        draggableInstance?.kill();
        window.removeEventListener("resize", resize);
      };
    });
  }, []);

  return (
    <section id="artists">
      {/* Title */}
      <h2 className="py-4 md:py-10">THE ARTIST</h2>

      {/* Wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full h-105 lg:h-140 overflow-hidden"
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center absolute top-1/2 -translate-y-1/2 gap-6 md:gap-8 lg:gap-10"
        >
          {loopImages.map((artist, i) => (
            <div
              key={i}
              className="artist-card
                relative
                shrink-0
                overflow-hidden
                w-45 h-65
                md:w-80 md:h-90
                lg:w-100 lg:h-120
                rounded-lg"
            >
              {/* Image */}
              <img
                src={artist.image}
                alt={artist.name}
                className={`w-full h-full object-cover rounded-lg ${artist.position}`}
                draggable={false}
              />
              {/* Noise Overlay */}
              <img
                src="/images/noise.png"
                alt=""
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                  opacity-45
                  mix-blend-overlay
                  pointer-events-none
                  rounded-lg
                "
              />

              {/* Name */}
              {activeReal === i && (
                <div className="absolute bottom-4 md:bottom-8 left-0 w-full text-center">
                  <p
                    className="artist-name uppercase text-2xl md:text-3xl lg:text-5xl tracking-widest text-white font-semibold"
                    style={{
                      textShadow: `
        0 0 10px rgba(255,255,255,0.8),
        0 0 20px rgba(255,255,255,0.5),
        0 2px 10px rgba(0,0,0,0.9),
        0 6px 20px rgba(0,0,0,0.9),
        0 12px 30px rgba(0,0,0,0.8)
      `,
                    }}
                  >
                    {artist.name}
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
