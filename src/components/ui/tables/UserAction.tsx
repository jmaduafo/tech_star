"use client";
import React, { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import Loading from "../Loading";
import {
  collection,
  doc,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import ProfileCard from "../cards/ProfileCard";
import { editMember } from "@/zod/actions";
import Input from "../input/Input";

type Dialog = {
  readonly data: User | undefined;
};

function UserAction({ data }: Dialog) {
  const { userData } = useAuth();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEditSheetOpen, setViewEditSheetOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      editMember(prevState, formData, {
        id: data?.id as string,
        team_id: data?.team_id as string,
      }),
    {
      message: "",
      success: false,
    }
  );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* VIEW DETAILS DROPDOWN DIALOG */}
          <DropdownMenuItem
            onClick={() => {
              setViewDialogOpen(true);
              setEditDialogOpen(false);
            }}
          >
            View profile
          </DropdownMenuItem>
          {userData?.role === "admin" || userData?.role === "editor" ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setViewDialogOpen(false);
                }}
              >
                Edit member
              </DropdownMenuItem>{" "}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* DISPLAY TEAM MEMBER'S INFORMATION */}
      <ProfileCard
        user={data}
        profileOpen={viewDialogOpen}
        setProfileOpen={setViewDialogOpen}
        editProfileOpen={viewEditSheetOpen}
        setEditProfileOpen={setViewEditSheetOpen}
        // ONLY HIDE EDIT BUTTON IF THE PROFILE IS NOT THE USER'S
        hideEdit={userData?.id !== data?.id}
      />
      {/* DELETE CONTRACT/PAYMENT ITEM */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              user from our servers.
            </DialogDescription>
          </DialogHeader>
          <form>
            <Input htmlFor={"full_name"} label={"Full name"}>
              <input className="disabledForm" type="text" id="full_name" name="full_name" disabled/>
            </Input>
            <Input htmlFor={"email"} label={"Email"} className="mt-4">
              <input className="disabledForm" type="text" id="email" name="email" disabled/>
            </Input>
            <Input htmlFor={"role"} label={"Role"} className="mt-4">
              <input className="form" type="text" id="role" name="role"/>
            </Input>
            <Input htmlFor={"hire_type"} label={"Hire type"} className="mt-4">
              <input className="form" type="text" id="hire_type" name="hire_type"/>
            </Input>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAction;
