"use client"
import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import { User } from '@/types/types'
import { getQueriedCount } from '@/firebase/actions'
import { db } from '@/firebase/config'
import { query, collection, where } from 'firebase/firestore'

function ActiveContractors({ user }: { readonly user: User | undefined}) {
  const [ totalContractors, setTotalContractors ] = useState<number | undefined>()
  
    const getContractors = async () => {
      try {
        if (!user) {
          return;
        }
  
        const q = query(
          collection(db, "contractors"),
          where("team_id", "==", user?.team_id),
          where("is_unavailable", "!=", true)
        );
  
        const count = await getQueriedCount(q)
  
        setTotalContractors(count)
  
      } catch (err: any) {
        console.log(err.message)
      }
    }
  
    useEffect(() => {
      getContractors()
    }, [ user?.id ?? "guest"])
  return (
    <SummaryCard title='Active Contractors' content={totalContractors}/>
  )
}

export default ActiveContractors