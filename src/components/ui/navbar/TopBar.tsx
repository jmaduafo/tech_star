import React from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
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
        </DialogHeader>
        <div className="w-full text-dark75">
          <Header6 text="Background"/>
          <Carousel
            className="w-[80%] mx-auto mt-4"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="">
              {images.map((item) => (
                <CarouselItem
                  key={item.image}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <button
                    className="rounded-md hover:opacity-80 duration-300 w-full h-[60px] bg-cover bg-center bg-no-repeat"
                    key={item.image}
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
