"use client"
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/MyCard";
import Header3 from "@/components/fontsize/Header3";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Banner from "@/components/ui/Banner";
import { getQueriedItems } from "@/firebase/actions";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import NotAvailable from "@/components/ui/NotAvailable";
import { optionalS } from "@/utils/optionalS";
import TextButton from "@/components/ui/buttons/TextButton";
import { Payment } from "@/types/types";

function PaymentDisplay() {
  const [ latestPayments, setLatestPayments ] = useState<Payment[] | undefined>()


  const invoices = [
    {
      contractor: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      projectName: "Credit Card",
      date: "Jan. 4, 2025",
    },
    {
      contractor: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      projectName: "PayPal",
      date: "Dec. 25, 2024",
    },
    {
      contractor: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      projectName: "Bank Transfer",
      date: "Nov. 17, 2024",
    },
    {
      contractor: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      projectName: "Credit Card",
      date: "Nov. 1, 2024",
    },
    {
      contractor: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      projectName: "PayPal",
      date: "Oct. 19, 2024",
    },
  ];

  function getLatest() {
    const q = query(
      collection(db, "payments"),
      orderBy("date", "desc"),
      limit(5)
    );

   
  }


  return (
    <div></div>
  );
}

export default PaymentDisplay;
