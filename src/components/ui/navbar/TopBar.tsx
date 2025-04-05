"use client";
import React from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import AppearanceSettings from "./settings/appearance/AppearanceSettings";
import ProfileSettings from "./settings/profile/ProfileSettings";
import SecuritySettings from "./settings/security/SecuritySettings";

function TopBar() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p>LOGO</p>
      </div>
      <div className="flex gap-3">
        <ProfileButton />
        <SettingButton />
      </div>
    </div>
  );
}

export default TopBar;

function ProfileButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
          title="Profile"
        >
          <HiUser className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className=""></div>
      </DialogContent>
    </Dialog>
  );
}

function SettingButton() {

  const { userData } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
          title="Setting"
        >
          <HiMiniCog8Tooth className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Modify and customize to fit your needs
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <ProfileSettings user={userData}/>
          <AppearanceSettings user={userData} />
          <SecuritySettings user={userData}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
