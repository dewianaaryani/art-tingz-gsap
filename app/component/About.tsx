"use client";
import React from "react";
import Statue from "./three-drei/Statue";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function About() {
  const statueRef = React.useRef<HTMLDivElement>(null);
  const elementHoverRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const statue = statueRef.current;
    const elementHover = elementHoverRef.current;

    if (!statue || !elementHover) return;

    // --- Hover tooltip ---
    gsap.set(elementHover, { autoAlpha: 0 });

    const show = gsap.to(elementHover, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
      paused: true,
    });

    const onEnter = () => show.play();
    const onLeave = () => show.reverse();

    statue.addEventListener("mouseenter", onEnter);
    statue.addEventListener("mouseleave", onLeave);

    // --- Split title ---
    const splitTitle = new SplitText(".statue-title", {
      type: "lines",
    });

    // --- Main timeline ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "+=180%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
      },
      defaults: { ease: "power4.out" },
    });

    tl.from(".left-box", {
      opacity: 0,
      scaleY: 0,
      transformOrigin: "top",
      stagger: 0.15,
      duration: 1,
    })
      .from(
        ".middle-box",
        {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.15,
          duration: 1,
        },
        "<",
      )
      .from(".statue-image", {
        opacity: 0,
        duration: 2,
      })
      .from(
        ".frame-line",
        {
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.1,
          duration: 0.8,
        },
        "-=1.2",
      )
      .from(
        splitTitle.lines,
        {
          opacity: 0,
          y: 80,
          stagger: 0.12,
          duration: 1.4,
        },
        "-=0.8",
      )
      .from(
        ".statue-description",
        {
          opacity: 0,
          x: -40,
          duration: 1,
        },
        "-=0.6",
      );

    return () => {
      statue.removeEventListener("mouseenter", onEnter);
      statue.removeEventListener("mouseleave", onLeave);

      show.kill();
      tl.kill();
      splitTitle.revert();
    };
  });

  return (
    <section id="about">
      <div className="upper-content">
        <h1 className="statue-title">THE WORLD'S LEADING STATUE MUSEUM</h1>

        <div className="statue-frame" ref={statueRef}>
          <Statue />
          <div className="element-hover" ref={elementHoverRef}>
            <img
              src="icons/arrow-left.svg"
              alt="Arrows"
              className="arrows rotate-12 md:rotate-14"
            />
            Rotate
            <img
              src="icons/arrow-right.svg"
              alt="Arrows"
              className="arrows -rotate-12 md:-rotate-14"
            />
          </div>
          <div></div>
          <span className="frame-line top" />
          <span className="frame-line right" />
          <span className="frame-line bottom" />
          <span className="frame-line left" />
        </div>
        <div className="bg-box">
          <span className="left-box" />
          <span className="middle-box" />
        </div>
      </div>

      <div className="statue-description">
        <p className="statue-desc">
          Discover a curated collection of the world's most iconic classical
          sculptures. Each piece reflects centuries of artistic mastery,
          cultural heritage, and human expression — preserved in marble, bronze,
          and stone for generations to admire.
        </p>
      </div>
    </section>
  );
}
