import Image from "next/image";
import Hero from "./component/Hero";
import Navbar from "./component/Navbar";

export default function Home() {
  return (
    <main className="bg-image">
      <Navbar />
      <Hero />
    </main>
  );
}
