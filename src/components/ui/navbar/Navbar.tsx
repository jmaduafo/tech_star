import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

function Navbar() {
  return (
    <div>
      <TopBar />
      <div className="mt-2">
        <BottomBar />
      </div>
    </div>
  );
}

export default Navbar;
