import Image from "next/image";
import Hero from "./component/Hero";
import Navbar from "./component/Navbar";
import About from "./component/About";
import Events from "./component/Events";
import Statue from "./component/Statue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin);
export default function Home() {
  return (
    <main className="bg-image">
      <Navbar />
      <Hero />
      <About />
      <Events />
      <Statue />
    </main>
  );
}
