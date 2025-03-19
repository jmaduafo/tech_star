"use client";
import React, { useState, useEffect } from "react";
import { fullDate, fullTime } from "@/utils/dateAndTime";
import { Sunrise, Sunset, CloudSun, CloudMoon } from "lucide-react";

function TimeDate({
  timeFontSize,
  dateFontSize,
}: {
  readonly timeFontSize?: string;
  readonly dateFontSize?: string;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState({
    hour: "00",
    minutes: "00",
  });

  useEffect(() => {
    function setNow() {
      setDate(fullDate());
      setTime({ hour: fullTime().hour, minutes: fullTime().minutes });
    }

    const intervalId = setInterval(setNow, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function timeIcon(hour: string) {
    if (+hour >= 20 || (+hour >= 0 && +hour < 7)) {
      return (
        <CloudMoon
          strokeWidth={1.5} className={timeFontSize === "dashboard" ? "w-14 h-14" : "w-[5vw]"}
        />
      );
    } else if (+hour >= 7 && +hour < 10) {
      return (
        <Sunrise strokeWidth={1.5} className={timeFontSize === "dashboard" ? "w-14 h-14" : "w-[5vw]"} />
      );
    } else if (+hour >= 10 && +hour < 18) {
      return (
        <CloudSun strokeWidth={1.5} className={timeFontSize === "dashboard" ? "w-14 h-14" : "w-[5vw]"} />
      );
    } else {
      return (
        <Sunset strokeWidth={1.5} className={timeFontSize === "dashboard" ? "w-14 h-14" : "w-[5vw]"} />
      );
    } 
  }

  return (
    <div>
      <div className={`flex justify-center items-end gap-2 tracking-tighter`}>
        {/* TIME ICON */}
        <div className="text-lightText duration-200">{timeIcon(time.hour)}</div>
        {/* TIME DISPLAY */}
        <div className="flex justify-center">
          <p
            className={`text-center leading-[1] font-semibold ${
              timeFontSize === "dashboard" ? "text-[4vw]" : "text-[9vh]"
            }`}
          >
            {time.hour}
          </p>
          <p
            className={`text-center leading-[1] font-semibold animate-pulse ${
              timeFontSize === "dashboard" ? "text-[4vw]" : "text-[9vh]"
            }`}
          >
            :
          </p>
          <p
            className={`text-center leading-[1] font-semibold ${
              timeFontSize === "dashboard" ? "text-[4vw]" : "text-[9vh]"
            }`}
          >
            {time.minutes}
          </p>
        </div>
      </div>
      <p
        className={`text-center font-medium tracking-tight ${
          dateFontSize === "dashboard" ? "text-[18px]" : "text-[26px]"
        }`}
      >
        {date}
      </p>
    </div>
  );
}

export default TimeDate;
