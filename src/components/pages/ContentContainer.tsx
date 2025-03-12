import React from "react";

function ContentContainer({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full xs:w-[95%] sm:w-[85%] mx-auto">{children}</div>
  );
}

export default ContentContainer;
