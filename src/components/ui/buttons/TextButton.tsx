import Link from "next/link";
import React from "react";

function TextButton({
  text,
  icon,
  iconDirection,
  href
}: {
  readonly text: string;
  readonly icon?: React.ReactNode;
  readonly iconDirection?: "left" | "right";
  readonly href?: string;
}) {
  return (
    <Link href={href ?? ""}>
      <button className="flex items-center gap-1 hover:opacity-75 duration-300">
        {iconDirection?.toLowerCase() === "left" ? <span>{icon}</span> : null}
        <p className="text-[14.5px]">{text}</p>
        {iconDirection?.toLowerCase() === "right" ? <span>{icon}</span> : null}
      </button>
    </Link>
  );
}

export default TextButton;
