import React from 'react'

function Header5({ text, className }: { text: string, className?: string}) {
  return (
    <h5 className={`${className} leading-[1] text-[18px]`}>{text}</h5>
  )
}

export default Header5