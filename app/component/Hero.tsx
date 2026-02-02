import Image from "next/image";
import React from "react";

const Hero = () => {
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
