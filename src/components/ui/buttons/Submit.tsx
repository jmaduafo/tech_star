import React from "react";
import { HiChevronRight } from "react-icons/hi2";
import Loading from "../Loading";

function Submit({
  setIsClicked,
  isClicked,
}: {
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isClicked: boolean;
}) {
  return (
    <button
      type="submit"
      className="rounded-full w-[160px] h-[60px] bg-dark35 group"
      disabled={isClicked ?? false}
    >
      <span
        onClick={() => {
          setIsClicked((prev) => !prev);
        }}
        className={`${
          isClicked ? "w-full" : "w-[60px]"
        } duration-300 rounded-full flex justify-end items-center h-full bg-darkText px-1 group-hover:bg-dark75`}
      >
        {isClicked ? <Loading className="mr-2"/> : <HiChevronRight className="w-10 h-10" />}
      </span>
    </button>
  );
}

export default Submit;
