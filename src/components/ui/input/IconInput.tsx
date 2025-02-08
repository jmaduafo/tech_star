import React from 'react'

function IconInput({ icon, input }: { icon: React.ReactNode, input: React.ReactNode}) {
  return (
    <div className='rounded-full flex gap-1 p-1 bg-light35 backdrop-blur-xl w-full'>
        <div className='p-2 rounded-full bg-darkText text-lightText'>
            {icon}
        </div>
        <div className='flex-1'>
            {input}
        </div>
    </div>
  )
}

export default IconInput