import Card from '@/components/ui/cards/MyCard'
import { User } from '@/types/types'
import React from 'react'

function ContractorChart({ user }: { readonly user: User | undefined}) {
    // CONTRACTORS VS NUMBER OF PAYMENTS (BAR CHART)
  return (
    <Card className='h-full'>
      <div></div>
    </Card>
  )
}

export default ContractorChart