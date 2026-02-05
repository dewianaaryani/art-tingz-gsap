import React from "react";
import Statue from "./three-drei/Statue";

export default function About() {
  return (
    <section id="about">
      <div className="upper-content">
        <h1 className="statue-title">THE WORLD’S LEADING STATUE MUSEUM</h1>

        {/* Image Frame */}
        <div className="statue-frame">
          {/* <img
            src="/images/about-img.png"
            alt="Classical marble statue"
            className="statue-image"
          /> */}
          <Statue />
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
        <p>
          Discover a curated collection of the world’s most iconic classical
          sculptures. Each piece reflects centuries of artistic mastery,
          cultural heritage, and human expression — preserved in marble, bronze,
          and stone for generations to admire.
        </p>
      </div>
    </section>
  );
}
