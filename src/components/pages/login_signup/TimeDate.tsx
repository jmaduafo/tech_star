"use client";
import React, { useState, useEffect } from "react";
import { fullDate, fullTime } from "@/utils/dateAndTime";
import { WiHorizonAlt, WiDayCloudy, WiNightAltCloudy } from "react-icons/wi";

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
    if (+hour >= 0 && +hour < 12) {
      return <WiHorizonAlt className={timeFontSize === "dashboard" ? 'w-14 h-14' : ''}/>
    } else if (+hour >= 12 && +hour < 17) {
      return <WiDayCloudy className={timeFontSize === "dashboard" ? 'w-14 h-14' : ''}/>
    } else if (+hour >=17 && +hour <= 23) {
      return <WiNightAltCloudy className={timeFontSize === "dashboard" ? 'w-14 h-14' : ''}/>
    }
  }

  return (
    <div>
      <div className={`flex justify-center items-end gap-2 tracking-tighter`}>
        {/* TIME ICON */}
        <div className="text-accent1">{timeIcon(time.hour)}</div>
        {/* TIME DISPLAY */}
        <div className="flex justify-center">
          <p
            className={`text-center leading-[1] font-semibold ${timeFontSize === "dashboard" ? 'text-[4vw]' : 'text-[9vh]'}`}
          >
            {time.hour}
          </p>
          <p
            className={`text-center leading-[1] font-semibold animate-pulse ${timeFontSize === "dashboard" ? 'text-[4vw]' : 'text-[9vh]'}`}
          >
            :
          </p>
          <p
            className={`text-center leading-[1] font-semibold ${timeFontSize === "dashboard" ? 'text-[4vw]' : 'text-[9vh]'}`}
          >
            {time.minutes}
          </p>
        </div>
      </div>
      <p
        className={`text-center font-medium tracking-tight ${dateFontSize === "dashboard" ? 'text-[18px]' : 'text-[26px]'}`}
      >
        {date}
      </p>
    </div>
  );
}

export default TimeDate;
