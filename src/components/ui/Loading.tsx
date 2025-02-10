import React from 'react'

function Loading({className}: { readonly className?: string}) {
  return (
    <div className={`w-8 h-8 rounded-full border-transparent border-t-lightText border-[3px] animate-spin ${className}`}></div>
  )
}

export default Loading