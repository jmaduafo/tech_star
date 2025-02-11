import React from 'react'

function Card({ children, className }: { readonly children: React.ReactNode, readonly className?: string}) {
  return (
    <section className={`px-8 py-6 rounded-[40px] bg-light25 backdrop-blur-[10000px] ${className}`}>
      {children}
    </section>
  )
}

export default Card