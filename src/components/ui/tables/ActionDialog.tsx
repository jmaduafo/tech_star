"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Contract, Payment } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateAndTime";
import Banner from "../Banner";
import { formatCurrency } from "@/utils/currencies";
import { format } from "timeago.js";
import { deleteItem } from "@/firebase/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type Dialog = {
  readonly data: Contract | Payment | undefined;
  readonly is_payment?: boolean;
};

function ActionDialog({ data, is_payment }: Dialog) {
  const { userData } = useAuth();

  const { toast } = useToast();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const ongoing =
    !data?.is_completed && data?.is_contract ? "ongoing" : "pending";

  const paid = data?.is_completed && !data?.is_contract ? "paid" : ongoing;

  async function handleDelete(id: string) {
    try {
      setLoadingDelete(true);

      await deleteItem("contracts", id);

      toast({});
    } catch (err: any) {
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setViewDialogOpen(true);
              setEditDialogOpen(false);
              setDeleteDialogOpen(false);
            }}
          >
            View details
          </DropdownMenuItem>
          {!is_payment ? (
            <Link
              href={`/projects/${data?.project_id}/contractors/${data?.contractor_id}/contract/${data?.id}`}
            >
              <DropdownMenuItem>View payments</DropdownMenuItem>
            </Link>
          ) : null}
          {userData?.is_admin ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setViewDialogOpen(false);
                  setDeleteDialogOpen(false);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setEditDialogOpen(false);
                  setViewDialogOpen(false);
                }}
              >
                Delete
              </DropdownMenuItem>{" "}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* VIEW DETAILS DROPDOWN DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contract overview</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            {/* CONTRACTOR NAME & PROJECT NAME */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail title="contractor" item={data?.contractor_name} />
              </div>
              <div className="flex-1">
                <Detail title="project name" item={data?.project_name} />
              </div>
            </div>
            {/* CONTRACT CODE & BANK NAMES  */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.contract_code ? (
                  <Detail title="contract code" item={data?.contract_code} />
                ) : (
                  <Detail title="contract code" item="N/A" />
                )}
              </div>
              <div className="flex-1">
                {data?.date ? (
                  <Detail title="Contract date" item={formatDate(data?.date)} />
                ) : null}
              </div>
            </div>
            {/* BANK NAMES AND CONTRACT DESCRIPTION */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail
                  title="Bank"
                  item={data?.bank_name}
                  className="capitalize"
                />
              </div>
              <div className="flex-1">
                <Detail title="description" item={data?.description} />
              </div>
            </div>
            {/* STAGE NAME & CONTRACT AMOUNTS */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.stage_name ? (
                  <Detail title="Stage" item={data.stage_name} />
                ) : null}
              </div>
              <div className="flex-1">
                {data?.currency_amount && data?.currency_code ? (
                  <Detail
                    title="Amount"
                    item={
                      data?.currency_amount !== "Unlimited" &&
                      data?.currency_code
                        ? data?.currency_code +
                          " " +
                          formatCurrency(
                            +data?.currency_amount,
                            data?.currency_code
                          )
                        : `${data?.currency_symbol} Unlimited`
                    }
                  />
                ) : null}
              </div>
            </div>
            {/* CONTRACT STATUS & OPTIONAL COMMENT */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail title="Status" custom>
                  <Banner
                    text={
                      data?.is_completed && data?.is_contract
                        ? "completed"
                        : paid
                    }
                  />
                </Detail>
              </div>
              <div className="flex-1">
                {data?.comment ? (
                  <Detail title="comments" item={data?.comment} />
                ) : (
                  <Detail title="comments" item="N/A" />
                )}
              </div>
            </div>
            {/* UPDATED AT */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.updated_at ? (
                  <Detail
                    title="Updated"
                    item={format(data?.updated_at?.seconds)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose className="text-dark90">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* EDIT CONTRACT ITEMS DROPDOWN DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Modify your item here.</DialogDescription>
          </DialogHeader>
          {/* Add your edit form inside DialogContent */}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              row and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-darkText">
              Cancel
            </AlertDialogCancel>
            {data ? (
              <AlertDialogAction onClick={() => handleDelete(data?.id)}>
                Continue
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ActionDialog;

function Detail({
  children,
  title,
  item,
  custom,
  className,
}: {
  readonly children?: React.ReactNode;
  readonly title: string;
  readonly item?: string;
  readonly custom?: boolean;
  readonly className?: string;
}) {
  const render = item ? <Paragraph text={item} /> : null;

  return (
    <div className="mb-4">
      <Header6 text={title} className="capitalize text-darkText font-medium" />
      <div className={`mt-1 text-dark75 text-[14.5px] ${className}`}>
        {custom ? children : render}
      </div>
    </div>
  );
}
