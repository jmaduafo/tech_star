"use client";

import { Contract, Payment, TimeStamp } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import { formatDate } from "@/utils/dateAndTime";
import { ColumnDef } from "@tanstack/react-table";
import Banner from "../Banner";
import { Checkbox } from "../checkbox";

import ActionDialog from "./ActionDialog";
import { ArrowUpDown } from "lucide-react";

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
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contract code
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "contract_code",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "completed" : "ongoing"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
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
    header: () => {
      return (
        <div className="flex justify-end">
          <div>Amount</div>
        </div>
      );
    },
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies = row.original;

      return (
        <div className="text-right">
          {currencies?.currency_amount &&
          currencies?.currency_amount !== "Unlimited"
            ? formatCurrency(
                +currencies?.currency_amount,
                currencies?.currency_code
              )
            : `${currencies?.currency_symbol} Unlimited`}
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

export const nonContractColumns: ColumnDef<Payment>[] = [
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
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "paid" : "pending"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
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
    header: () => {
      return (
        <div className="flex justify-end">
          <div>Amount</div>
        </div>
      );
    },
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies = row.original;

      return (
        <div className="text-right">
          {currencies?.currency_amount &&
          currencies?.currency_amount !== "Unlimited"
            ? formatCurrency(
                +currencies?.currency_amount,
                currencies?.currency_code
              )
            : `${currencies?.currency_symbol} Unlimited`}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;

      return (
        <div className="flex justify-around">
          <ActionDialog data={contract} />
        </div>
      );
    },
  },
];

export const latestColumns: ColumnDef<Payment>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contract code
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "contract_code",
    cell: ({ row }) => {
      const code: string = row.getValue("contract_code");

      return code ? <div className="">{code}</div> : <div className="">--</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "paid" : "pending"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
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
    header: () => {
      return (
        <div className="flex justify-end">
          <div>Amount</div>
        </div>
      );
    },
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies = row.original;

      return (
        <div className="text-right">
          {currencies?.currency_amount &&
          currencies?.currency_amount !== "Unlimited"
            ? formatCurrency(
                +currencies?.currency_amount,
                currencies?.currency_code
              )
            : `${currencies?.currency_symbol} Unlimited`}
        </div>
      );
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
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contract code
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "contract_code",
    cell: ({ row }) => {
      const code: string = row.getValue("contract_code");

      return code ? <div className="">{code}</div> : <div className="">--</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
            >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");
      
      return <Banner text={status ? "paid" : "pending"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: TimeStamp = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
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
    header: () => {
      return (
        <div className="flex justify-end">
          <div>Amount</div>
        </div>
      );
    },
    accessorKey: "currencies",
    cell: ({ row }) => {
      const currencies = row.original;

      return (
        <div className="text-right">
          {currencies?.currency_amount &&
          currencies?.currency_amount !== "Unlimited"
            ? formatCurrency(
                +currencies?.currency_amount,
                currencies?.currency_code
              )
            : `${currencies?.currency_symbol} Unlimited`}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-around">
          <ActionDialog data={payment} is_payment />
        </div>
      );
    },
  },
];
