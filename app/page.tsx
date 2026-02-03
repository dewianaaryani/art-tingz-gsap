import Image from "next/image";
import Hero from "./component/Hero";
import Navbar from "./component/Navbar";
import About from "./component/About";
import Events from "./component/Events";
export default function Home() {
  return (
    <main className="bg-image">
      <Navbar />
      <Hero />
      <About />
      <Events />
    </main>
  );
}
