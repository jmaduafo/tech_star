"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../button";

interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    // Handles displaying the data as rows
    getCoreRowModel: getCoreRowModel(),
    // Handles pagination
    getPaginationRowModel: getPaginationRowModel(),
    // Handles sorting functionality
    getSortedRowModel: getSortedRowModel(),
    // Handles sorting functionality
    getFilteredRowModel: getFilteredRowModel(),

    // Setting states for sorting and filter functionalities
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-5 flex items-end gap-4">
        <input
          placeholder="Filter description..."
          className="searchTable flex-shrink-1 placeholder:text-light70 max-w-sm backdrop-blur-2xl"
          value={
            (table.getColumn("description")?.getFilterValue() as string) || ""
          }
          onChange={(e) =>
            table.getColumn("description")?.setFilterValue(e.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns
              <ChevronDown className="text-darkText" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
      <div className="flex justify-between items-end mt-3">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-3">
          {/* PREVIOUS */}
          <button
            className={`${
              table.getCanPreviousPage() ? "opacity-100 cursor-pointer" : "opacity-50 cursor-default"
            } flex items-center gap-1 duration-300`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span>
              <ChevronLeft className="w-4 h-4" />
            </span>
            <span>Previous</span>
          </button>
          <p>Page {table.getPageCount()}</p>
          {/* NEXT */}
          <button
            className={`${
              table.getCanNextPage() ? "block" : "opacity-50"
            } flex items-center gap-1 duration-300`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>Next</span>
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
