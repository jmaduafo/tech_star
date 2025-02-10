import React from 'react'

function Card({ children, className }: { readonly children: React.ReactNode, readonly className?: string}) {
  return (
    <div className={`px-8 py-6 rounded-[40px] bg-light35 backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  )
}

export default Card