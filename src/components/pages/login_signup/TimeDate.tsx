"use client"
import React, { useState, useEffect } from 'react'
import { fullDate, fullTime } from '@/utils/dateAndTime'

function TimeDate() {
    const [ date, setDate ] = useState("")
    const [ time, setTime ] = useState({
        hour: "00",
        minutes: "00"
    })

    useEffect(() => {

        function setNow() {
            setDate(fullDate())
            setTime({hour: fullTime().hour, minutes: fullTime().minutes})
        }
      
          const intervalId = setInterval(setNow, 1000);
      
          return () => clearInterval(intervalId);
    }, [])
    
  return (
    <div>
            <div className="flex tracking-tighter">
              <p className="text-center text-[9vw] leading-[1] font-semibold">
                {time.hour}
              </p>
              <p className="text-center text-[9vw] leading-[1] font-semibold animate-pulse">
                :
              </p>
              <p className="text-center text-[9vw] leading-[1] font-semibold">
                {time.minutes}
              </p>
            </div>
            <p className="text-center text-[26px] font-medium tracking-tight">{date}</p>
          </div>
  )
}

export default TimeDate