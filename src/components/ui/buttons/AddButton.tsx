import React from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddButton({
  children,
  title,
  buttonTitle,
  desc,
  footerButton,
}: {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly buttonTitle?: string;
  readonly desc: string;
  readonly footerButton?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="font-light flex items-center gap-1 py-2.5 sm:py-1.5 px-4 bg-darkText rounded-lg hover:opacity-80 duration-300">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">Add {buttonTitle}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a {title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footerButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddButton;
