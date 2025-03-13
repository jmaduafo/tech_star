"use client"

import { ContractTable, PaymentTable } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table"

export const contractColumns: ColumnDef<ContractTable>[] = [
    {
        header: "Select",
        accessorKey: "id"
    },
    {
        header: "Contract code",
        accessorKey: "contract_code"
    },
    {
        header: "Status",
        accessorKey: "status"
    },
    {
        header: "Date",
        accessorKey: "date"
    },
    {
        header: "Description",
        accessorKey: "description"
    },
    {
        header: "Amount",
        accessorKey: "amount"
    },
]

export const paymentColumns: ColumnDef<PaymentTable>[] = [
    {
        header: "Select",
        accessorKey: "id"
    },
    {
        header: "Date",
        accessorKey: "date"
    },
    {
        header: "Status",
        accessorKey: "status"
    },
    {
        header: "Description",
        accessorKey: "description"
    },
    {
        header: "Amount",
        accessorKey: "amount"
    },
]