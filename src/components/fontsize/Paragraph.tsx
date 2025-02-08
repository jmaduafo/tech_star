import React from 'react'

function Paragraph({ text, className }: { text: string, className?: string}) {
  return (
    <p className={`${className} text-[14px]`}>{text}</p>
  )
}

export default Paragraph