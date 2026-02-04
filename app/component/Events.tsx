"use client";
import { UpcomingEvents } from "@/constant";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Events() {
  const eventRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalEvents = UpcomingEvents.length;
  const gotToSlide = (index: number) => {
    const newIndex = (index + totalEvents) % totalEvents;
    setCurrentIndex(newIndex);
  };
  const getEventAt = (indexOffset: number) => {
    return UpcomingEvents[
      (currentIndex + indexOffset + totalEvents) % totalEvents
    ];
  };
  const progressBar = ((currentIndex + 1) / totalEvents) * 100;
  const currentEvent = getEventAt(0);
  //upcoming random date but not more than 7 days
  const randomFutureDate = () => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 10) + 1; // 1–10 days
    const randomHours = Math.floor(Math.random() * 24);

    now.setDate(now.getDate() + randomDays);
    now.setHours(now.getHours() + randomHours);

    return now;
  };
  const getCountdown = (targetDate: Date): string => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return "Event started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days ${hours} hours remaining`;
  };

  const [countdown, setCountdown] = useState("");

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
            <div className="flex flex-col">
              <h3>{currentEvent.title}</h3>
              {/* count down */}
              <p>{countdown}</p>
              <p className="desc-event">{currentEvent.desc}</p>
            </div>
          </div>
          <Image
            width={200}
            height={400}
            src={currentEvent.image}
            alt={currentEvent.title}
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
                onClick={() => gotToSlide(currentIndex - 1)}
              />
              <ArrowRight
                className="arrow"
                onClick={() => gotToSlide(currentIndex + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
