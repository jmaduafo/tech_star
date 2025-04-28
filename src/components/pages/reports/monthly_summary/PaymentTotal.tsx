"use client"
import React, { useState, useEffect } from 'react'
import SummaryCard from './SummaryCard'
import { getQueriedCount } from '@/firebase/actions'
import { User } from '@/types/types'
import { collection, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { pastMonth } from '@/utils/dateAndTime'

function PaymentTotal({ user }: { readonly user: User | undefined}) {
  const [ totalPayments, setTotalPayments ] = useState<number | undefined>()

  const getPayments = async () => {
    try {
      if (!user) {
        return;
      }

      const q = query(
        collection(db, "payments"),
        where("team_id", "==", user?.team_id),
        where("date", ">=", pastMonth().startTime),
        where("date", "<=", pastMonth().endTime)
      );

      const count = await getQueriedCount(q)

      setTotalPayments(count)

    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getPayments()
  }, [ user?.id ?? "guest"])

  return (
    <SummaryCard title='Total payments' content={totalPayments}/>
  )
}

export default PaymentTotal