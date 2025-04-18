import React, { useEffect, useActionState, useState, useRef } from "react";
import { User } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../sheet";
import Header4 from "@/components/fontsize/Header4";
import Header6 from "@/components/fontsize/Header6";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { MapPin, Pencil } from "lucide-react";
import { Skeleton } from "../skeleton";
import { getInitials } from "@/utils/initials";
import Detail from "./Detail";
import { formatDate } from "@/utils/dateAndTime";
import { auth } from "@/firebase/config";
import Input from "../input/Input";
import SelectBar from "../input/SelectBar";
import { country_list, job_titles } from "@/utils/dataTools";
import { SelectItem } from "../select";
import Submit from "../buttons/Submit";
import { editUser } from "@/zod/actions";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/firebase/actions";
import FilePicker from "../buttons/FilePicker";

type Card = {
  readonly user: User | undefined;
  readonly profileOpen: boolean;
  readonly setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly editProfileOpen?: boolean;
  readonly setEditProfileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  readonly hideProfile?: boolean;
};

function ProfileCard({
  user,
  profileOpen,
  setProfileOpen,
  editProfileOpen,
  setEditProfileOpen,
  hideProfile,
}: Card) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const [state, action, isLoading] = useActionState(editUser, {
    data: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      location: user?.location ?? "",
      job_title: user?.job_title ?? "",
    },
    message: "",
    success: false,
  });

  const currentUser = auth.currentUser;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editProfileOpen) {
      setProfileOpen(true);
    }
  }, [editProfileOpen]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // INITIALIZE WITH THE CURRENT IMAGE IN CASE THE USER MADE NO CHANGES TO THEIR PROFILE PIC
    let imageUrl = currentImage;

    // IF USER HAS CHOSEN A NEW IMAGE, THEN REPLACE PREVIOUS IMAGE WITH THE NEW IMAGE
    if (newImage) {
      // Upload the new image to Firebase Storage
      imageUrl = await uploadImage(newImage, `users/${user?.id}`);
    }

    const formData = new FormData(e.currentTarget);
    // CREATE A NEW KEY UNDER FORM DATA AND SET THE CHOSEN IMAGE
    formData.append("image_url", imageUrl as string);

    action(formData); // call useActionState's action function
  };

  return (
    <>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent
          className="sm:max-w-md"
          aria-describedby="user profile display"
        >
          <DialogHeader>
            <DialogTitle className="capitalize">
              {currentUser?.uid === user?.id ? "My" : user?.first_name + "'s"}{" "}
              Profile
            </DialogTitle>
          </DialogHeader>
          <div className="text-dark75">
            <div className="flex justify-center mt-2">
              {!user ? (
                <div>
                  <Skeleton className="w-[140px] h-[140px] rounded-full" />
                </div>
              ) : (
                <div className="relative">
                  <Avatar className="w-[140px] h-[140px]">
                    <AvatarImage src="https://github.com" alt="@shadcn" />
                    <AvatarFallback className="text-5xl">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setEditProfileOpen && setEditProfileOpen(true);
                    }}
                    className={`${
                      hideProfile ? "hidden" : "flex"
                    } absolute transform translate-x-[-50%] translate-y-[-50%] top-[90%] right-0 justify-center items-center w-7 h-7 rounded-full bg-darkText text-lightText hover:bg-dark85`}
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1} />
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              {!user ? (
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-[60%]" />
                </div>
              ) : (
                <Header4
                  text={user?.full_name}
                  className="text-center font-medium"
                />
              )}
            </div>
            <div className="mt-2">
              {!user ? (
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-[30%]" />
                </div>
              ) : user?.location ? (
                <div className="flex justify-center items-end gap-1">
                  <MapPin strokeWidth={1} className="w-4 h-4" />
                  <Header6 text={user.location} />
                </div>
              ) : null}
            </div>
            <div className="mt-2">
              {!user ? (
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-[30%]" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Header6
                    text={user?.role}
                    className="text-center capitalize w-fit rounded-full px-4 py-1 border border-darkText"
                  />
                </div>
              )}
            </div>
            <div className="mt-5">
              {/* FIRST NAME & LAST NAME */}
              <div className="flex items-start">
                <div className="flex-1">
                  {user ? (
                    <Detail title="First name" item={user?.first_name} />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
                <div className="flex-1">
                  {user ? (
                    <Detail title="Last name" item={user?.last_name} />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
              </div>
              {/* EMAIL & HIRE TYPE */}
              <div className="flex items-start">
                <div className="flex-1">
                  {user ? (
                    <Detail title="Email" item={user?.email} />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
                <div className="flex-1">
                  {user ? (
                    <Detail
                      title="Hire type"
                      className="capitalize"
                      item={user?.hire_type}
                    />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
              </div>
              {/* JOB TITLE & CREATED AT */}
              <div className="flex items-start">
                <div className="flex-1">
                  {user ? (
                    <Detail
                      title="Job title"
                      className="capitalize"
                      item={user?.job_title ?? "N/A"}
                    />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
                <div className="flex-1">
                  {user ? (
                    <Detail
                      title="Joined at"
                      item={formatDate(user?.created_at, 2)}
                    />
                  ) : (
                    <Skeleton className="w-[55%] h-5" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Sheet open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex justify-center">
              <Avatar className="w-[110px] h-[110px]">
                {imagePreview && (
                  <AvatarImage src={imagePreview} alt="new image preview" />
                )}
                {!imagePreview && currentImage && (
                  <AvatarImage src={currentImage} alt="current image preview" />
                )}
                <AvatarFallback className="text-5xl">
                  {getInitials(user ? user?.full_name : "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-6">
              <FilePicker
                title="Change profile image"
                setNewImage={setNewImage}
                setImagePreview={setImagePreview}
                inputRef={fileInputRef}
              />
            </div>
            <Input label="First name" htmlFor="first_name" className="mt-4">
              <input
                className="form"
                type="text"
                id="first_name"
                name="first_name"
                defaultValue={state?.data?.first_name}
              />
            </Input>
            <Input label="Last name" htmlFor="last_name" className="mt-4">
              <input
                className="form"
                type="text"
                id="last_name"
                name="last_name"
                defaultValue={state?.data?.last_name}
              />
            </Input>
            <Input label="Location" htmlFor="location" className="mt-4">
              <SelectBar
                placeholder={"Select your location"}
                label={"Location"}
                name="location"
                defaultValue={state?.data?.location}
                className="mt-1 w-full"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem value={item.code} key={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </Input>
            <Input label="Job title" htmlFor="job_title" className="mt-4">
              <SelectBar
                placeholder={"Select a job title"}
                label={"Job title"}
                name="job_title"
                defaultValue={state?.data?.job_title}
                className="mt-1 w-full"
              >
                {job_titles.map((item) => {
                  return (
                    <SelectItem value={item} key={item}>
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
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ProfileCard;
