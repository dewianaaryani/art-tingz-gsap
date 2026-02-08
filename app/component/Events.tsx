"use client";
import { UpcomingEvents } from "@/constant";
import { getCountdown, randomFutureDate } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Events() {
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isAnimating, setIsAnimating] = useState(false);

  const eventRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState("");
  const totalEvents = UpcomingEvents.length;
  const gotToSlide = (index: number, dir: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);

    const el = eventRef.current;
    if (!el) return;

    const newIndex = (index + totalEvents) % totalEvents;

    const offset = dir === 1 ? 120 : -120;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
    });

    // Slide OUT
    tl.to(el, {
      x: -offset,
      opacity: 0,
      duration: 0.4,
    })

      // Change content
      .add(() => {
        setCurrentIndex(newIndex);
      })

      // Prepare new slide
      .set(el, {
        x: offset,
      })

      // Slide IN
      .to(el, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          setIsAnimating(false);
        },
      });
  };

  const getEventAt = (indexOffset: number) => {
    return UpcomingEvents[
      (currentIndex + indexOffset + totalEvents) % totalEvents
    ];
  };
  const progressBar = ((currentIndex + 1) / totalEvents) * 100;
  const currentEvent = getEventAt(0);
  //upcoming random date but not more than 7 days

  useEffect(() => {
    const eventDate = randomFutureDate();

    const interval = setInterval(() => {
      setCountdown(getCountdown(eventDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
                {/* count down */}
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
            {/* Fill */}
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressBar}%` }}
            />

            {/* Dot */}
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
