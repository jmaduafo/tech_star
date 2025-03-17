"use client";

import { Amount, Contract, Payment, TimeStamp } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import { formatDate } from "@/utils/dateAndTime";
import { ColumnDef } from "@tanstack/react-table";
import Banner from "../Banner";
import { Checkbox } from "../checkbox";

import ActionDialog from "./ActionDialog";
export const contractColumns: ColumnDef<Contract>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    accessorKey: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: () => <div className="whitespace-nowrap">Contract code</div>,
    accessorKey: "contract_code",
  },
  {
    header: "Status",
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "completed" : "ongoing"} />;
    },
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");

      return (
        <div className="">
          {desc.length > 40 ? desc.substring(0, 41) + "..." : desc}{" "}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-right">Amount</div>,
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies: Amount[] = row.getValue("currencies");

      return (
        <div className="text-right">
          {currencies[0]?.amount !== "Unlimited"
            ? formatCurrency(currencies[0]?.amount, currencies[0]?.code)
            : `${currencies[0]?.symbol} Unlimited`}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;

      return <ActionDialog data={contract} />;
    },
  },
];

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    accessorKey: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "paid" : "pending"} />;
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");

      return (
        <div className="">
          {desc.length > 40 ? desc.substring(0, 41) + "..." : desc}{" "}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-right">Amount</div>,
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies: Amount[] = row.getValue("currencies");

      return (
        <div className="text-right">
          {currencies[0]?.amount !== "Unlimited"
            ? formatCurrency(currencies[0]?.amount, currencies[0]?.code)
            : `${currencies[0]?.symbol} Unlimited`}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;

      return <ActionDialog data={contract} />;
    },
  },
];
