"use client";
import React from "react";
import { nav } from "../../constant";
import { Menu } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "gsap/all";

export default function Navbar() {
  useGSAP(() => {
    const showAnim = gsap
      .from(".main-tool-bar", {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      // markers: true,
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });
  });
  return (
    <header className="main-tool-bar">
      <nav>
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={item.href}>{item.name}</a>
            </li>
          ))}

          {/* Menu icon */}
          <li className="hamburger-menu">
            <Menu size={28} className="cursor-pointer " />
          </li>
        </ul>
      </nav>
    </header>
  );
}
