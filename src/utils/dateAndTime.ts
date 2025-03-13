import { TimeStamp } from "@/types/types";
import { months, days } from "./dataTools";

export function fullTime() {
  const now = new Date();
  let hour = ""
  let minutes = "";

  if (now.getHours().toString().length === 1) {
    hour += "0" + now.getHours() 
  } else {
    hour += now.getHours()
  }

  if (now.getMinutes().toString().length === 1) {
    minutes += "0" + now.getMinutes() 
  } else {
    minutes += now.getMinutes()
  }

  return { hour, minutes };
}

export function fullDate() {
  const now = new Date();
  let date = "";

  // Ex: Thu., Feb. 6, 2025
  date +=
    days[now.getDay()] +
    ", " +
    months[now.getMonth()].substring(0, 3) +
    ". " +
    now.getDate() +
    ", " +
    now.getFullYear();

  return date;
}

export function formatDate(timestamp: TimeStamp) {
  const date = new Date(timestamp.seconds*1000)

  const format = date.getDate() + " " + months[date.getMonth()].substring(0, 3) + " " + date.getFullYear().toString().slice(2)

  return format
}