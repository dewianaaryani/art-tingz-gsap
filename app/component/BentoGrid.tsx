"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, Flip);

const BentoGallery = () => {
  const images = [
    "https://assets.codepen.io/16327/portrait-pattern-1.jpg",
    "https://assets.codepen.io/16327/portrait-image-12.jpg",
    "https://assets.codepen.io/16327/portrait-image-8.jpg",
    "https://assets.codepen.io/16327/portrait-pattern-2.jpg",
    "https://assets.codepen.io/16327/portrait-image-4.jpg",
    "https://assets.codepen.io/16327/portrait-image-3.jpg",
    "https://assets.codepen.io/16327/portrait-pattern-3.jpg",
    "https://assets.codepen.io/16327/portrait-image-1.jpg",
  ];

  const getGridArea = (index: number) => {
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
    return areas[index - 1] || "";
  };

  useGSAP(() => {
    const galleryElement = document.querySelector("#gallery-8");
    if (!galleryElement) return;

    const galleryItems = galleryElement.querySelectorAll(".gallery__item");

    let flipCtx: gsap.Context | undefined;

    flipCtx?.revert();
    galleryElement.classList.remove("gallery--final");

    flipCtx = gsap.context(() => {
      // Temporarily add the final class to capture the final state
      galleryElement.classList.add("gallery--final");
      const flipState = Flip.getState(galleryItems);
      galleryElement.classList.remove("gallery--final");

      const flip = Flip.to(flipState, {
        simple: true,
        ease: "expoScale(1, 5)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: galleryElement,
          start: "center center",
          end: "+=100%",
          scrub: true,
          pin: galleryElement.parentElement,
        },
      });
      tl.add(flip);
      return () => gsap.set(galleryItems, { clearProps: "all" });
    });
  }, []);

  // Handle resize by recreating the animation (simplified, runs once on mount)
  useEffect(() => {
    const handleResize = () => {
      // In a real app, you might want to debounce this and recreate the GSAP context
      window.location.reload(); // Simple reload for demo; replace with proper recreation if needed
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="gallery-wrap">
        <div
          className="gallery gallery--bento gallery--switch grid gap-2 grid-cols-[repeat(3,32.5vw)] grid-rows-[repeat(4,23vh)] justify-center content-center"
          id="gallery-8"
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="gallery__item bg-center bg-cover flex-none relative"
              style={{ gridArea: getGridArea(index + 1) }}
            >
              <img src={src} alt="" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="section p-8 md:px-20">
        <h2 className="text-2xl mb-4">Here is some content</h2>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-xl mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <style jsx>{`
        .gallery-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .gallery {
          position: relative;
          width: 100%;
          height: 100%;
          flex: none;
        }
        .gallery--final.gallery--bento {
          grid-template-columns: repeat(3, 100vw);
          grid-template-rows: repeat(4, 49.5vh);
          gap: 1vh;
        }
      `}</style>
    </>
  );
};

export default BentoGallery;
