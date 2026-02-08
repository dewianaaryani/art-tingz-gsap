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
  const lockScroll = (lock: boolean) => {
    document.body.style.overflow = lock ? "hidden" : "";
  };

  const statueRef = React.useRef<HTMLDivElement>(null);
  const elementHoverRef = React.useRef<HTMLDivElement>(null);
  useGSAP(() => {
    let hasJumped = false;
    const statue = statueRef.current;
    const elementHover = elementHoverRef.current;
    if (!statue || !elementHover) return;

    gsap.set(elementHover, { autoAlpha: 0 });
    const show = gsap.to(elementHover, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    });
    const onEnter = () => show.play();
    const onLeave = () => show.reverse();

    statue.addEventListener("mouseenter", onEnter);
    statue.addEventListener("mouseleave", onLeave);

    // Split title into multiple lines for line-by-line animation
    const splitTitle = new SplitText(".statue-title", {
      type: "lines",
    });

    // Create main GSAP timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "+=180%",
        scrub: 0.6,
        pin: true,

        onUpdate(self) {
          if (self.progress > 0.98 && !hasJumped) {
            hasJumped = true;

            const eventsEl = document.querySelector("#events");
            if (!eventsEl) return;
            // 🔒 Lock scroll before pin releases
            lockScroll(true);

            gsap.delayedCall(0.1, () => {
              gsap.to(window, {
                scrollTo: {
                  y: eventsEl,
                  autoKill: false,
                },
                duration: 1.4,
                ease: "expo.inOut",
                onComplete: () => {
                  lockScroll(false);
                },
              });
            });
          }
        },

        onLeaveBack() {
          hasJumped = false;
        },
      },

      defaults: {
        ease: "power4.out", // Default easing for all animations
      },
    });

    // 1️⃣ Left background box animation
    tl.from(".left-box", {
      opacity: 0, // Start invisible
      scaleY: 0, // Start with zero height
      transformOrigin: "top", // Grow from top
      stagger: 0.15, // Delay between elements (if multiple)
      duration: 1, // Animation duration (1s)
    })

      // 2️⃣ Middle box (starts at same time as left box)
      .from(
        ".middle-box",
        {
          opacity: 0, // Start invisible
          scaleX: 0, // Start with zero width
          transformOrigin: "left", // Grow from left
          stagger: 0.15,
          duration: 1,
        },
        "<", // Start at same time as previous animation
      )

      // 3️⃣ Statue (3D Canvas wrapper)
      .from(".statue-image", {
        opacity: 0, // Fade in
        duration: 2, // Slow reveal
      })

      // 4️⃣ Frame lines animation
      .from(
        ".frame-line",
        {
          scaleX: 0, // Start with no width
          transformOrigin: "left",
          stagger: 0.1, // Animate lines one by one
          duration: 0.8,
        },
        "-=1.2", // Start 1.2s before previous ends (overlap)
      )

      // 5️⃣ Title animation (line by line)
      .from(
        splitTitle.lines,
        {
          opacity: 0, // Start invisible
          y: 80, // Start lower
          stagger: 0.12, // Delay between lines
          duration: 1.4,
        },
        "-=0.8", // Overlap with frame animation
      )

      // 6️⃣ Description container
      .from(
        ".statue-description",
        {
          opacity: 0, // Fade in
          x: -40, // Move up slightly
          duration: 1,
        },
        "-=0.6",
      );
    // AFTER timeline
    // const eventsEl = document.querySelector("#events") as HTMLElement | null;
    // if (!eventsEl) return;
    // ScrollTrigger.create({
    //   trigger: "#about",
    //   start: "bottom bottom",
    //   once: true,

    //   onEnter: () => {
    //     gsap.to(window, {
    //       duration: 1.2,
    //       ease: "power2.inOut",

    //       scrollTo: {
    //         y: eventsEl,
    //         autoKill: false,
    //       },
    //     });
    //   },
    // });

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

        {/* Image Frame */}
        <div className="statue-frame" ref={statueRef}>
          {/* <img
            src="/images/about-img.png"
            alt="Classical marble statue"
            className="statue-image"
          /> */}
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
      {/* Description */}
      <div className="statue-description">
        <p className="statue-desc">
          Discover a curated collection of the world’s most iconic classical
          sculptures. Each piece reflects centuries of artistic mastery,
          cultural heritage, and human expression — preserved in marble, bronze,
          and stone for generations to admire.
        </p>
      </div>
    </section>
  );
}
