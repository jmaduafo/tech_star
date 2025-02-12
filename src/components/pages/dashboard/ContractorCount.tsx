import Header6 from '@/components/fontsize/Header6'
import React from 'react'

function ContractorCount() {
  return (
    <div className='flex h-full justify-center items-end'>
      <div className='mb-3'>
        <p className="text-center font-semibold text-[4vw] leading-[1]">48</p>
        <Header6 text="Total Contractors" className='text-center mt-3'/>
      </div>
    </div>
  )
}

export default ContractorCount