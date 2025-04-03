import Header6 from '@/components/fontsize/Header6'
import { User } from '@/types/types'
import React from 'react'

function SecuritySettings({ user }: { readonly user: User | undefined}) {
  return (
    <section>
        <Header6 text="Security settings" className="text-darkText mb-4" />
    </section>
  )
}

export default SecuritySettings