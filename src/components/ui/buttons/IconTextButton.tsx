"use client"
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
      className={`${textNav?.toLowerCase() === text.toLowerCase() ? 'bg-darkText text-lightText' : 'bg-transparent text-darkText'} flex items-center gap-2 px-6 py-1 rounded-full border-[1.2px] border-darkText group duration-300 hover:bg-darkText hover:text-lightText`}
    >
      <span>{icon}</span>
      <span className="">{text}</span>
    </button>
  );
}

export default IconTextButton;
