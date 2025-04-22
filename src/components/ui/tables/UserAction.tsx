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
import ProfileCard from "../cards/ProfileCard";
import { editMember } from "@/zod/actions";
import Input from "../input/Input";
import SelectBar from "../input/SelectBar";
import { SelectItem } from "../select";
import Submit from "../buttons/Submit";

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
        role: user.role,
        hire_type: user.hire_type,
      }),
    {
      message: "",
      success: false,
    }
  );

  const [user, setUser] = useState({
    role: "",
    hire_type: "",
  });

  useEffect(() => {
    if (data) {
      setUser({
        role: data?.role ?? "",
        hire_type: data?.hire_type ?? "",
      });
    }
  }, [data?.id ?? "guest"]);

  useEffect(() => {
    if (!state?.success && state?.message.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title:
          "Team member was added successfully! New user can now sign in to view team dashboard.",
      });
    }
  }, [state]);

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
      {/* EDIT MEMBER INFORMATION ITEM */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              user from our servers.
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            <Input htmlFor={"full_name"} label={"Full name"}>
              <input
                className="disabledForm"
                type="text"
                id="full_name"
                name="full_name"
                disabled
                value={data?.full_name}
              />
            </Input>
            <Input htmlFor={"email"} label={"Email"} className="mt-4">
              <input
                className="disabledForm"
                type="text"
                id="email"
                name="email"
                disabled
                value={data?.email}
              />
            </Input>
            {/* ROLES */}
            <Input label="Role" htmlFor="" className="mt-5">
              <SelectBar
                name="role"
                placeholder={"Select a role *"}
                label={"Roles *"}
                className="mt-1.5"
                value={user.role}
                valueChange={(text) =>
                  setUser((prev) => ({
                    ...prev,
                    role: text,
                  }))
                }
              >
                {["Viewer", "Editor", "Admin"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </Input>
            {/* HIRE TYPE */}
            <Input htmlFor={"hire_type"} label={"Hire type"} className="mt-5">
              <SelectBar
                name="hire_type"
                placeholder={"Select a hire type *"}
                label={"Hire type *"}
                className="mt-1.5"
                value={user.hire_type}
                valueChange={(text) =>
                  setUser((prev) => ({
                    ...prev,
                    hire_type: text,
                  }))
                }
              >
                {["Employee", "Contractor", "Independent"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </Input>
            <div className="flex justify-end mt-6">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={isLoading}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAction;
