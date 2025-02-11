import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

function Navbar() {

  return (
    <header className="">
      <TopBar />
      <div className="mt-2">
        <BottomBar  />
      </div>
    </header>
  );
}

export default Navbar;
