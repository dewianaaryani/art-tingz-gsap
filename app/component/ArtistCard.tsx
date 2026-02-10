"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { artistImages } from "@/constant";

gsap.registerPlugin(Draggable);

export default function ArtistCard() {
  const loopImages = [...artistImages, ...artistImages, ...artistImages];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;

    const getItemSize = () => {
      const track = trackRef.current;

      if (!track) return 300;

      const first = track.querySelector(".artist-card") as HTMLElement | null;

      if (!first) return 300;

      const gap = parseFloat(
        window.getComputedStyle(track).columnGap ||
          window.getComputedStyle(track).gap ||
          "0",
      );

      return first.offsetWidth + gap;
    };

    let itemSize = getItemSize();

    const baseLength = artistImages.length; // 7
    const totalItems = baseLength * 3;
    const totalWidth = totalItems * itemSize;

    // Start from middle copy
    const startIndex = baseLength;

    let activeIndex = startIndex;
    const getCardWidth = () => {
      const track = trackRef.current;

      if (!track) return 200;

      const first = track.querySelector(".artist-card") as HTMLElement | null;

      if (!first) return 200;

      return first.offsetWidth;
    };

    const getCenterX = () => {
      const width = getCardWidth();
      return window.innerWidth / 2 - width / 2;
    };

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
      itemSize = getItemSize();
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
    <section id="artists">
      {/* Title */}
      <h2>THE ARTIST</h2>

      {/* Wrapper */}
      <div ref={wrapperRef} className="relative w-full h-105 overflow-hidden">
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
                md:w-55 md:h-75
                lg:w-65 lg:h-85
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
                "
              />

              {/* Name */}
              {active === i % artistImages.length && (
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <p className="">{artist.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
