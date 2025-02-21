import React from 'react'

function Card({ children, className }: { readonly children: React.ReactNode, readonly className?: string}) {
  return (
    <section className={`px-8 py-6 rounded-[40px] bg-light20 backdrop-blur-3xl ${className}`}>
      {children}
    </section>
  )
}

export default Card