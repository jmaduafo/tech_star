import React from 'react'

function Banner({ text }: { readonly text: string}) {

    function colorPalette(text: string) {
        if (text === "Pending".toLowerCase()) {
            return "bg-pendingBg border-pendingBorder"
        } 
        else if (text === "Paid".toLowerCase()) {
             return "bg-paidBg border-paidBorder"
        }
        else if (text === "Ongoing".toLowerCase()) {
             return "bg-ongoingBg border-ongoingBorder"
        }
        else if (text === "Completed".toLowerCase()) {
             return "bg-completedBg border-completedBorder"
        }
    }
  return (
    <p className={`px-5 py-1 ${colorPalette(text)}`}>{text}</p>
  )
}

export default Banner