import React from "react";
import Header6 from "@/components/fontsize/Header6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Input from "../input/Input";
import Submit from "../buttons/Submit";
import { User } from "@/types/types";

function ProfileSettings({ user }: { readonly user: User | undefined}) {
  return (
    <section className="mb-6">
      <Header6 text="Profile settings" className="text-darkText mb-4" />
      {/* UPDATE NAME, EMAIL, OR USERNAME */}
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Update names</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input htmlFor={"first_name"} label={"First name"}>
                  <input className="form" id="first_name" name="first_name" />
                </Input>
                <Input
                  htmlFor={"last_name"}
                  label={"Last name"}
                  className="mt-3"
                >
                  <input className="form" id="last_name" name="last_name" />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={true}
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Update username</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input htmlFor={"username"} label={"Username"} className="mt-3">
                  <input className="form" id="username" name="username" />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={true}
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Update email</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input htmlFor={"user_email"} label={"Email"} className="mt-3">
                  <input className="form" id="user_email" name="user_email" />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={true}
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Change password</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input
                  htmlFor={"user_password"}
                  label={"Password"}
                  className="mt-3"
                >
                  <input
                    className="form"
                    id="user_password"
                    name="user_password"
                    type="password"
                  />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={true}
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default ProfileSettings;
