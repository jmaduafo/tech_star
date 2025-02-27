import React from "react";
import { HiChevronRight } from "react-icons/hi2";
import Loading from "../Loading";

function Submit({
  loading,
}: {
  readonly loading: boolean;
}) {

  return (
    <button
      type="submit"
      className="rounded-full w-[160px] h-[60px] bg-dark35 group"
      disabled={loading ?? false}
    >
      <span
        className={`${
          loading ? "w-full" : "w-[60px]"
        } duration-300 rounded-full flex justify-end items-center h-full bg-darkText px-1 group-hover:bg-dark75`}
      >
        {loading ? (
          <Loading className="mr-2" />
        ) : (
          <HiChevronRight className="w-10 h-10" />
        )}
      </span>
    </button>
  );
}

export default Submit;
