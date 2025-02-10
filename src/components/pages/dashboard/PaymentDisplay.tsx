import React from 'react'
import Card from '@/components/ui/Card'
import Header2 from '@/components/fontsize/Header2'
import Header3 from '@/components/fontsize/Header3'

function PaymentDisplay() {
  return (
    <Card className='w-full h-[30vh]'>
        <Header3 text="Latest Payments"/>
    </Card>
  )
}

export default PaymentDisplay