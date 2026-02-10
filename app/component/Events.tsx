"use client";
import { UpcomingEvents } from "@/constant";
import { getCountdown, randomFutureDate } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Events() {
  const [isAnimating, setIsAnimating] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState("");
  const totalEvents = UpcomingEvents.length;

  // FIX: Generate the date once and store it in a ref so it doesn't
  // regenerate on every render / remount, which caused countdown to reset.
  const eventDateRef = useRef<Date | null>(null);
  if (!eventDateRef.current) {
    eventDateRef.current = randomFutureDate();
  }

  const gotToSlide = (index: number, dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const el = eventRef.current;
    if (!el) return;

    const newIndex = (index + totalEvents) % totalEvents;
    const offset = dir === 1 ? 120 : -120;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    tl.to(el, { x: -offset, opacity: 0, duration: 0.4 })
      .add(() => setCurrentIndex(newIndex))
      .set(el, { x: offset })
      .to(el, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        onComplete: () => setIsAnimating(false),
      });
  };

  const getEventAt = (indexOffset: number) =>
    UpcomingEvents[(currentIndex + indexOffset + totalEvents) % totalEvents];

  const progressBar = ((currentIndex + 1) / totalEvents) * 100;
  const currentEvent = getEventAt(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (eventDateRef.current) {
        setCountdown(getCountdown(eventDateRef.current));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); // stable — no deps that change

  return (
    <section id="events">
      <h1>Upcoming Events</h1>
      <div className="event-section">
        <div ref={eventRef} className="event-item">
          <div className="text-event-detail">
            <h2>{currentIndex + 1}</h2>
            <div className="flex flex-col md:gap-2">
              <div>
                <h3>{currentEvent.title}</h3>
                <p className="desc-event">{currentEvent.desc}</p>
              </div>
              <p className="countdown">{countdown}</p>
            </div>
          </div>
          <Image
            src={currentEvent.image}
            alt={currentEvent.title}
            fill
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover object-top"
          />
          <div className="img-gradient" />
        </div>

        <div className="utils-event">
          <div className="left-utils">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressBar}%` }}
            />
            <div
              className="w-4 h-4 bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `calc(${progressBar}% - 8px)` }}
            />
          </div>
          <div className="right-utils">
            <h3>Know More</h3>
            <div className="arrows">
              <ArrowLeft
                className="arrow"
                onClick={() => gotToSlide(currentIndex - 1, -1)}
              />
              <ArrowRight
                className="arrow"
                onClick={() => gotToSlide(currentIndex + 1, 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
