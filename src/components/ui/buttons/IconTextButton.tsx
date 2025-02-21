"use client";
import React from "react";

function IconTextButton({
  icon,
  text,
  textNav,
  setText,
}: {
  readonly icon: React.ReactNode;
  readonly text: string;
  readonly setText?: React.Dispatch<React.SetStateAction<string>>;
  // textNav is the pathname
  readonly textNav?: string;
}) {
  return (
    <button
      onClick={() => setText && setText(text.toLowerCase())}
      className={`${
        textNav?.toLowerCase() === text.toLowerCase()
          ? "bg-light85"
          : "bg-transparent"
      } text-darkText flex items-center gap-2 px-6 py-2 rounded-full group duration-300 hover:bg-light85`}
    >
      <span>{icon}</span>
      <span className="">{text}</span>
    </button>
  );
}

export default IconTextButton;
