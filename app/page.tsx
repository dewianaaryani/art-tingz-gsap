import Image from "next/image";
import Hero from "./component/Hero";
import Navbar from "./component/Navbar";
import About from "./component/About";
import Events from "./component/Events";
import Statue from "./component/Statue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable, Flip } from "gsap/all";
import Artist from "./component/Artist";
import CardGallery from "./component/CardGallery";

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin, Draggable);
export default function Home() {
  return (
    <main className="bg-image">
      <Navbar />
      <Hero />
      <div>
        <About />
        <Events />
      </div>

      <Statue />

      <Artist />
    </main>
  );
}
