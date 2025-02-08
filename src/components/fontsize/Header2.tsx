import React from 'react'

function Header2({ text, className }: { text: string, className?: string}) {
  return (
    <h2 className={`${className} leading-[1] text-[42px]`}>{text}</h2>
  )
}

export default Header2