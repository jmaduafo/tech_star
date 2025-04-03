"use client";

import { Contract, Payment, TimeStamp, User } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import { formatDate } from "@/utils/dateAndTime";
import { ColumnDef } from "@tanstack/react-table";
import Banner from "../Banner";
import { Checkbox } from "../checkbox";

import ActionDialog from "./ActionDialog";
import { ArrowUpDown } from "lucide-react";
import OnlineStatus from "../OnlineStatus";
import UserAction from "./UserAction";

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

export const teamColumns: ColumnDef<User>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "full_name",
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
    accessorKey: "is_online",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_online");

      return <OnlineStatus status={status ? "online" : "offline"} />;
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
            Email
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "email",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Role
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "role",
    cell: ({ row }) => {
      const user = row.original;

      return user?.is_owner ? (
        <div className="flex items-center gap-1 text-[14px]">
          <div className="py-1 px-3 border border-lightText bg-darkText rounded-full capitalize">owner</div>
          <div className="py-1 px-3 border border-lightText rounded-full capitalize">{user.role}</div>
        </div>
      ) : (
        <div className="text-[14px] py-1 px-3 border border-lightText rounded-full">
          {user.role}
        </div>
      );
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
            Hire Type
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "hire_type",
    cell: ({ row }) => {
      const type: string = row.getValue("hire_type");

      return <div className="capitalize">{type}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;

      return team?.is_owner ? <UserAction data={team} /> : null
    },
  },
];
