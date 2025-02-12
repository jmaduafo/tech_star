import React from 'react'

function NotAvailable({ text }: { readonly text: string}) {
  return (
    <p className='text-[15px]'>{text}</p>
  )
}

export default NotAvailable