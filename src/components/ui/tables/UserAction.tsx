"use client";
import React, { useEffect, useState } from "react";
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
import { User } from "@/types/types";
import { MoreHorizontal, CalendarIcon } from "lucide-react";
import SelectBar from "@/components/ui/input/SelectBar";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateAndTime";
import Banner from "../Banner";
import { formatCurrency } from "@/utils/currencies";
import { format as formatAgo } from "timeago.js";
import { format } from "date-fns";
import {
  deleteContractAndPayments,
  deleteItem,
  getQueriedItems,
  updateItem,
} from "@/firebase/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Loading from "../Loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import Input from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/Separator";
import { Switch } from "@/components/ui/switch";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import Submit from "../buttons/Submit";
import { db } from "@/firebase/config";

type Dialog = {
  readonly data: User | undefined;
};

function UserAction({ data }: Dialog) {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  //  WHEN BROWSER FIRST RENDERS, ADDS THE PRE EXISTING DATA OF CONTRACT OR PAYMENT TO
  //  THE APPROPRIATE INPUT FIELDS TO PREPARE FOR EDIT FUNCTIONALITY
  async function loadEditEntries() {
    try {
      if (!data || !userData) {
        return;
      }

    } catch (err: any) {
      console.log(err.message);
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
            View member
          </DropdownMenuItem>
          {userData?.is_owner || userData?.role === "admin" ? (
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
            <DialogTitle>
              Member overview
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form>

          </form>
          <DialogFooter>
            <DialogClose className="text-dark90">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* EDIT PAYMENT/CONTRACT ITEMS DROPDOWN DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Edit member
            </DialogTitle>
            <DialogDescription>Modify your item here.</DialogDescription>
          </DialogHeader>            
        </DialogContent>
      </Dialog>
      {/* DELETE CONTRACT/PAYMENT ITEM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this user from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-darkText">
              Cancel
            </AlertDialogCancel>
            {data ? (
              <AlertDialogAction
                onClick={() => {}}
              >
                {loadingDelete ? <Loading className="w-4 h-4"/> : "Continue"}
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserAction;

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