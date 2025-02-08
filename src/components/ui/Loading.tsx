import React from 'react'

function Loading({className}: { className?: string}) {
  return (
    <div className={`${className} w-8 h-8 rounded-full border-transparent border-t-lightText border-[3px] animate-spin`}></div>
  )
}

export default Loading