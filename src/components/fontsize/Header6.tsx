import React from 'react'

function Header6({ text, className }: { text: string, className?: string}) {
  return (
    <h6 className={`${className} leading-[1] text-[16px]`}>{text}</h6>
  )
}

export default Header6