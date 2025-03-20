"use client";
import React, { useState, useEffect } from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { images } from "@/utils/dataTools";
import Header6 from "@/components/fontsize/Header6";
import { useAuth } from "@/context/AuthContext";
import Submit from "../buttons/Submit";
import { updateItem } from "@/firebase/actions";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

function TopBar() {
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
  const [bgSelect, setBgSelect] = useState(0);
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();

  async function handleImageSubmit() {
    if (bgSelect === userData?.bg_image_index) {
      return;
    }

    try {
      setLoading(true);

      if (!userData) {
        return;
      }

      await updateItem("users", userData.id, {
        bg_image_index: bgSelect,
      });

      toast({
        title: "Background image successfully submitted!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh, something went wrong!",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function getBgIndex() {
    if (!userData) {
      return;
    }

    const userDoc = doc(db, "users", userData?.id)

    const unsub = onSnapshot(userDoc, (doc) => {
      doc.exists() ? setBgSelect(doc.data().bg_image_index) : setBgSelect(0)

      return () => unsub()
    })
    
  }

  useEffect(() => {
    getBgIndex()
  }, [userData?.id ?? "guest"]);

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
          <DialogDescription>Modify and customize to fit your needs</DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Header6 text="Set a background" className="text-darkText"/>
          <Carousel
            className="w-[80%] mx-auto mt-4"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="">
              {images.map((item, i) => (
                <CarouselItem key={item.image} className="basis-1/3">
                  <button
                    type="button"
                    onClick={() => setBgSelect(i)}
                    className={`${
                      i === bgSelect
                        ? "border-2 border-lightText"
                        : "border-none"
                    } rounded-md hover:opacity-80 duration-300 w-full h-[60px] bg-cover bg-center bg-no-repeat`}
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center mt-6 scale-75">
            <Submit loading={loading} buttonClick={handleImageSubmit}/>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
