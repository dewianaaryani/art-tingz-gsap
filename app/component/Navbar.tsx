import React from "react";
import { nav } from "../../constant";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header>
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
