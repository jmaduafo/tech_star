import Link from "next/link";
import React from "react";
import { HiArrowUpRight } from "react-icons/hi2";

function TextButton({
  text,
  icon,
  iconDirection,
  href
}: {
  readonly text: string;
  readonly icon?: React.ReactNode;
  readonly iconDirection: "left" | "right";
  readonly href?: string;
}) {
  return (
    <Link href={href ?? ""}>
      <button className="flex items-center gap-1 hover:opacity-75 duration-300">
        {iconDirection?.toLowerCase() === "left" ? <span>{icon ?? <HiArrowUpRight className="w-4 h-4"/>}</span> : null}
        <p className="text-[14.5px]">{text}</p>
        {iconDirection?.toLowerCase() === "right" ? <span>{icon ?? <HiArrowUpRight className="w-4 h-4"/>}</span> : null}
      </button>
    </Link>
  );
}

export default TextButton;
