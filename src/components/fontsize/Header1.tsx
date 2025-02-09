import React from 'react'

function Header1({ text, className }: { text: string, className?: string}) {
  return (
    <h1 className={`${className} tracking-[-0.03em] leading-[1] text-[51px]`}>{text}</h1>
  )
}

export default Header1