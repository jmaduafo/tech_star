import Header6 from "@/components/fontsize/Header6";
import { images } from "@/utils/dataTools";
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../../carousel";
import { User } from "@/types/types";
import { updateItem } from "@/firebase/actions";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { doc, onSnapshot } from "firebase/firestore";
import Submit from "../../../buttons/Submit";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function AppearanceSettings({ user }: { readonly user: User | undefined }) {
  const [bgSelect, setBgSelect] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleImageSubmit() {
    // DO NOTHING IF THE SELECTED BACKGROUND IS THE SAME AS THE PREEXISTING BACKGROUND IMAGE
    // WHEN SUBMIT IS CLICKED
    if (bgSelect === user?.bg_image_index) {
      return;
    }

    try {
      setLoading(true);

      if (!user) {
        return;
      }

      await updateItem("users", user.id, {
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

  // RETRIEVES THE PREEXISTING BACKGROUND THAT USER SELECTED
  async function getBgIndex() {
    if (!user) {
      return;
    }

    const userDoc = doc(db, "users", user?.id);

    const unsub = onSnapshot(userDoc, (doc) => {
      doc.exists() ? setBgSelect(doc.data().bg_image_index) : setBgSelect(0);

      return () => unsub();
    });
  }

  useEffect(() => {
    getBgIndex();
  }, [user?.id ?? "guest"]);

  return (
    <section className="mb-6">
      <Header6 text="Appearance settings" className="text-darkText mb-4" />
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Set a background</AccordionTrigger>
            <AccordionContent>
              <Carousel
                className="w-[70%] mx-auto mt-4"
                // ENABLES FOR THE CAROUSEL TO LOOP SEAMLESSLY
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
                        } rounded-md hover:opacity-80 duration-300 w-full h-[55px] bg-cover bg-center bg-no-repeat`}
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="flex justify-end mt-4">
                <Submit
                  loading={loading}
                  width_height="w-[85px] h-[40px]"
                  width="w-[40px]"
                  arrow_width_height="w-6 h-6"
                  disabledLogic={bgSelect === user?.bg_image_index}
                  buttonClick={handleImageSubmit}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default AppearanceSettings;
