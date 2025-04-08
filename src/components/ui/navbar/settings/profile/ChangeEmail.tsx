"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import { User } from "@/types/types";
import React from "react";

type Email = {
  readonly userEmail: string;
  readonly setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  readonly user: User | undefined;
};

function ChangeEmail({ userEmail, setUserEmail, user }: Email) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Update email</AccordionTrigger>
        <AccordionContent>
          <form>
            <Input htmlFor={"user_email"} label={"Email"} className="mt-3">
              <input
                className="form"
                id="user_email"
                name="user_email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={false}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={user?.email === userEmail}
              />
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ChangeEmail;
