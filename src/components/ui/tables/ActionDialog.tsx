"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
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
import { Contract, Payment } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateAndTime";
import Banner from "../Banner";

type Dialog = {
  readonly data: Contract | Payment | undefined;
};

function ActionDialog({ data }: Dialog) {
  const { userData } = useAuth();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>View details</span>
            </DropdownMenuItem>
          </DialogTrigger>
          {userData?.is_admin ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>{" "}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contract overview</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
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
          <div className="flex justify-between items-start gap-5">
            <div className="flex-1">
              <Detail title="Banks" custom={true}>
                {typeof data?.bank_name === "string" ? (
                  <p>{data.bank_name}</p>
                ) : (
                  data?.bank_name?.map((item, i) => {
                    return (
                      <div key={item} className="flex items-end gap-1">
                        <p className="capitalize">
                          {item}
                          <span
                            className={`${
                              i === data?.bank_name?.length - 1
                                ? "hidden"
                                : "block"
                            }`}
                          >
                            ,
                          </span>
                        </p>
                      </div>
                    );
                  })
                )}
              </Detail>
            </div>
            <div className="flex-1">
              <Detail title="description" item={data?.description} />
            </div>
          </div>
          <div className="flex justify-between items-start gap-5">
            <div className="flex-1">
              {data?.comment ? (
                <Detail title="comments" item={data?.comment} />
              ) : (
                <Detail title="comments" item="N/A" />
              )}
            </div>
            <div className="flex-1">
              <Detail title="Status" custom>
                <Banner
                  text={
                    data?.is_completed && data?.is_contract
                      ? "completed"
                      : data?.is_completed && !data?.is_contract
                      ? "paid"
                      : !data?.is_completed && data?.is_contract
                      ? "ongoing"
                      : "pending"
                  }
                />
              </Detail>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="text-dark90">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionDialog;

function Detail({
  children,
  title,
  item,
  custom,
}: {
  readonly children?: React.ReactNode;
  readonly title: string;
  readonly item?: string;
  readonly custom?: boolean;
}) {
  const render = item ? <Paragraph text={item} /> : null;

  return (
    <div className="mb-4">
      <Header6 text={title} className="capitalize text-darkText font-medium" />
      <div className="mt-1 text-dark75 text-[14.5px]">
        {custom ? children : render}
      </div>
    </div>
  );
}
