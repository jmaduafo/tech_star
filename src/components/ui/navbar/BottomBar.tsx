"use client"
import React, { useState } from "react";
import IconTextButton from "../buttons/IconTextButton";
import {
  BsColumnsGap,
  BsClipboard2Check,
  BsCashStack,
  BsPeopleFill,
  BsBarChartFill,
} from "react-icons/bs";
import Link from "next/link";

function BottomBar() {
  const [nav, setNav] = useState("Dashboard");

  const navLinks = [
    {
      text: "Dashboard",
      icon: <BsColumnsGap className="w-4 h-4" />,
    },
    {
      text: "Projects",
      icon: <BsClipboard2Check className="w-4 h-4" />,
    },
    {
      text: "Payments",
      icon: <BsCashStack className="w-4 h-4" />,
    },
    {
      text: "Charts",
      icon: <BsBarChartFill className="w-4 h-4" />,
    },
    {
      text: "Team",
      icon: <BsPeopleFill className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="flex justify-center item-center gap-8">
      {navLinks.map((item) => {
        return (
          <Link key={item.text} href={`/${item.text.toLowerCase()}`}>
            <IconTextButton
              textNav={nav}
              setText={setNav}
              text={item.text}
              icon={item.icon}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomBar;
