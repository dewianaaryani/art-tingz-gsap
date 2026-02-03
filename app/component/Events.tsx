"use client";
import { UpcomingEvents } from "@/constant";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Events() {
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
        {UpcomingEvents.map((event, index) => (
          <div key={event.id} className="event-item">
            <div className="text-event-detail">
              <h2>{index + 1}</h2>
              <div className="flex flex-col">
                <h3>{event.title}</h3>
                {/* count down */}
                <p>{countdown}</p>
              </div>
            </div>
            <Image
              width={200}
              height={400}
              src={event.image}
              alt={event.title}
              className="object-cover"
            />
            <div className="img-gradient" />
          </div>
        ))}
      </div>
    </section>
  );
}
