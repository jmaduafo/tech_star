import { User } from "@/types/types";
import React from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";

function TopBar({ user }: { readonly user: User | undefined}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p>LOGO</p>
      </div>
      <div className="flex gap-3">
        <UserButton />
        <SettingButton />
      </div>
    </div>
  );
}

export default TopBar;

function UserButton() {
  return (
    <div>
      <button className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300" title="Profile">
        <HiUser className="w-4 h-4" />
      </button>
    </div>
  );
}

function SettingButton() {
  return (
    <div>
      <button className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300" title="Setting">
        <HiMiniCog8Tooth className="w-4 h-4" />
      </button>
    </div>
  );
}
