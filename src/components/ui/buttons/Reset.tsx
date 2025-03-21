import { RefreshCw } from "lucide-react";
import React from "react";

function Reset({
  clickedFn,
  disabledLogic,
}: {
  readonly clickedFn: () => void;
  readonly disabledLogic?: boolean;
}) {
  return (
    <button
      onClick={clickedFn}
      disabled={disabledLogic}
      className="rounded-full"
    >
      <RefreshCw strokeWidth={1} className="text-lightText w-6 h-6" />
    </button>
  );
}

export default Reset;
