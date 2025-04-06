"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Input from "@/components/ui/input/Input";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/types";
import { updateItem } from "@/firebase/actions";
import Submit from "@/components/ui/buttons/Submit";
import { NamesValidation } from "@/zod/validation";

type Names = {
  readonly names: { first_name: string; last_name: string };
  readonly setNames: React.Dispatch<
    React.SetStateAction<{
      first_name: string;
      last_name: string;
    }>
  >;
  readonly user: User | undefined;
};

function ChangeNames({ names, setNames, user }: Names) {
  const [loading, setLoading] = useState(false);

  async function changeNames(formData: FormData) {
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");

    const values = {
      first_name: firstName,
      last_name: lastName,
    };

    const result = NamesValidation.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: `Uh oh! Something went wrong`,
        description: result.error.issues[0].message,
      });

      return;
    }

    const { first_name, last_name } = result.data;

    try {
      setLoading(true);

      if (!user) {
        return;
      }

      await updateItem("user", user?.id, {
        first_name,
        last_name,
        full_name: first_name + " " + last_name,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: `Uh oh! Something went wrong`,
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Update names</AccordionTrigger>
        <AccordionContent>
          <form action={changeNames}>
            <Input htmlFor={"first_name"} label={"First name"}>
              <input
                className="form"
                id="first_name"
                name="first_name"
                value={names.first_name}
                onChange={(e) =>
                  setNames({ ...names, first_name: e.target.value })
                }
              />
            </Input>
            <Input htmlFor={"last_name"} label={"Last name"} className="mt-3">
              <input
                className="form"
                id="last_name"
                name="last_name"
                value={names.last_name}
                onChange={(e) =>
                  setNames({ ...names, last_name: e.target.value })
                }
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={loading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={
                  user?.first_name === names.first_name &&
                  user?.last_name === names.last_name
                }
              />
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ChangeNames;
