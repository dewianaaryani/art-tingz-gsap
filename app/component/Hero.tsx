"use client";
import { useGSAP } from "@gsap/react";

import gsap, { SplitText } from "gsap/all";
import Image from "next/image";
import React from "react";

const Hero = () => {
  useGSAP(() => {
    const splitRight = new SplitText(".text-right", {
      type: "lines",
    });

    const splitLeft = new SplitText(".text-left", {
      type: "lines",
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
      },
    });

    tl.fromTo(
      ".image-hero",
      {
        opacity: 0,
        scale: 1.1,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 2,
        ease: "power4.out",
      },
    )

      // 2️⃣ Left text (line by line)
      .from(
        splitLeft.lines,
        {
          opacity: 0,
          yPercent: 100,
          duration: 1.4,
          stagger: 0.08,
        },
        "-=0.6", // overlap with image end
      )

      // 3️⃣ Right text
      .from(
        splitRight.lines,
        {
          opacity: 0,
          yPercent: 100,
          duration: 1.4,
          stagger: 0.08,
        },
        "-=0.8",
      );
  });

  return (
    <section id="hero">
      <Image
        src="/images/hero.png"
        className="image-hero"
        alt="hero"
        width={1200}
        height={500}
        loading="eager"
      />
      <div className="text-hero">
        <div className="hero-left-text">
          <h1 className="text-left flex-wrap">Welcome To</h1>
        </div>
        <div className="hero-right-text">
          <h1 className="text-right flex-wrap">The Statue of Ancient Greek</h1>
        </div>
      </div>
      <div></div>
    </section>
  );
};

export default Hero;
