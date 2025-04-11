"use client";
import React, { useActionState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Input from "@/components/ui/input/Input";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/types";
import Submit from "@/components/ui/buttons/Submit";
import { changeNames } from "@/zod/actions";

type Names = {
  readonly user: User | undefined;
};

function ChangeNames({ user }: Names) {
  const [state, action, isLoading] = useActionState(changeNames, {
    data: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
    message: "",
    success: false,
  });

  useEffect(() => {
    if (!state?.success && state?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });

    } else if (state?.success) {
      toast({
        title: "User's name was updated successfully!",
      });
    }
    
  }, [state]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Update names</AccordionTrigger>
        <AccordionContent>
          <form action={action}>
            <Input htmlFor={"first_name"} label={"First name"}>
              <input
                className="form"
                id="first_name"
                name="first_name"
                defaultValue={state?.data?.first_name}
              />
            </Input>
            <Input htmlFor={"last_name"} label={"Last name"} className="mt-3">
              <input
                className="form"
                id="last_name"
                name="last_name"
                defaultValue={state?.data?.last_name}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={
                  user?.first_name === state?.data?.first_name &&
                  user?.last_name === state?.data?.last_name
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
