"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [ sorting, setSorting ] = useState<SortingState>([])
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    // Handles displaying the data as rows
    getCoreRowModel: getCoreRowModel(),
    // Handles pagination
    getPaginationRowModel: getPaginationRowModel(),
    // Handles sorting functionality
    getSortedRowModel: getSortedRowModel(),

    // Setting states for sorting and filter functionalities
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    state: {
      sorting,
      columnFilters
    }
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {/* table.getHeaderGroups => an array that contains the headers from the "columns" definition */}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {/* Renders the headers accordingly  */}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* TABLE ROW DISPLAY */}

          {/* table.getRowModel => an array containing all the data according to the acc */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* PAGINATION NEXT AND PREVIOUS DISPLAY */}
      <div className="flex items-center justify-end gap-3 mt-3">
        {/* PREVIOUS */}
        <button
          className={`${table.getCanPreviousPage() ? "block" : "hidden"} flex items-center gap-1 duration-300`}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span><ChevronLeft className="w-4 h-4" /></span>
          <span>Previous</span>
        </button>
        {/* NEXT */}
        <button
          className={`${table.getCanNextPage() ? "block" : "hidden"} flex items-center gap-1 duration-300`}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span>Next</span>
          <span><ChevronRight className="w-4 h-4" /></span>
        </button>
      </div>
    </div>
  );
}

export default DataTable;
