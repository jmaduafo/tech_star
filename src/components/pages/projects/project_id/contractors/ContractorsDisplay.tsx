"use client";
import React, { Fragment, useActionState, useEffect, useState } from "react";
import { Contractor, User } from "@/types/types";
import Card from "@/components/ui/MyCard";
import { Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { country_list } from "@/utils/dataTools";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { createContractor } from "@/zod/actions";

function ContractorsDisplay({
  user,
  sort,
  searchValue,
  allContractors,
  filterSearch,
  projectId,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly projectId: string;
  readonly allContractors: Contractor[] | undefined;
  readonly filterSearch: Contractor[];
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      createContractor(
        prevState,
        formData,
        { id: user?.id as string, team_id: user?.team_id },
        projectId
      ),
    {
      data: {
        location: "",
        importance: [2.5],
        is_unavailable: false,
        name: "",
        additional: "",
      },
      message: "",
      success: false,
    }
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state?.success && state?.message.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title: "Stage was successfully updated!",
      });

      setOpen(false);
    }
  }, [state]);

  const checkAdmin =
    user?.is_owner || user?.role === "admin" ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* BUTTON TO ADD NEW PROJECT; ONLY ADMIN CAN ADD A NEW PROJECT */}
          <button>
            <Card className="h-[200px] text-lightText cursor-pointer flex justify-center items-center hover:opacity-80 duration-300 hover:shadow-md">
              <div className="">
                <div className="flex justify-center">
                  <Plus strokeWidth={1} className="w-16 h-16" />
                </div>
                <Header5 text="Add new contractor" className="text-center" />
              </div>
            </Card>
          </button>
        </DialogTrigger>
        {/* CREATE PROJECT DIALOG POPUP */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a contractor</DialogTitle>
            <DialogDescription>
              Access payments by adding a contractor
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            {/* PROJECT NAME */}
            <Input label="Contractor name *" htmlFor="name">
              <input
                name="name"
                id="name"
                className="form"
                type="text"
                defaultValue={state?.data?.name}
              />
            </Input>
            <div className="mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select contractor location"
                defaultValue={state?.data?.location}
                label="Countries"
                className="w-full"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <div className="mt-4">
              <label htmlFor="importance_level" className="">
                How crucial is contractor to project? (not as crucial to
                extremely crucial)
              </label>
              <p className="text-right text-dark75 text-[13px]">
                {state?.data?.importance}
              </p>
              <Slider
                name="importance"
                id="importance_level"
                defaultValue={state?.data?.importance}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>
            <Input
              label="Any additional information?"
              htmlFor="additional_info"
              className="mt-4 flex flex-col gap-3"
            >
              <textarea
                name="additional"
                id="additional_info"
                className="form"
                defaultValue={state?.data?.additional}
              ></textarea>
            </Input>
            <Input
              label="Is contractor unavailable?"
              htmlFor="status"
              className="mt-4 flex items-center justify-end gap-3"
            >
              <Switch
                id="status"
                name="status"
                defaultChecked={state?.data?.is_unavailable}
              />
            </Input>

            <div className="flex justify-center mt-6 scale-75">
              <Submit loading={isLoading} />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    ) : null;

  const filtered =
    filterSearch?.length && searchValue.length
      ? filterSearch.map((item) => {
          return (
            <Link
              href={`/projects/${item?.project_id}/contractors/${item?.id}`}
              key={item.id}
            >
              <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-80 duration-300 hover:shadow-md">
                <div className="flex flex-col h-full">
                  <Header4 text={item.name} className="capitalize" />
                  <p className="text-[14px] text-light50 italic">
                    {item.location}
                  </p>
                  <div className="mt-auto">
                    {item.is_unavailable ? (
                      <Banner text={"discontinued"} />
                    ) : null}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })
      : null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      {isLoading
        ? [0, 1, 2, 3, 4, 5].map((each, i) => {
            return (
              <Fragment key={`${each}_${i}`}>
                <Skeleton className="h-[200px] rounded-[40px]" />
              </Fragment>
            );
          })
        : checkAdmin}
      {allContractors?.length && !filterSearch.length && !searchValue.length
        ? allContractors?.map((item) => {
            return (
              <Link
                href={`/projects/${item?.project_id}/contractors/${item?.id}`}
                key={item.id}
              >
                <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-80 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <Header4 text={item.name} className="capitalize" />
                    <p className="text-[14px] text-light50 italic">
                      {item.location}
                    </p>
                    <div className="mt-auto">
                      {item.is_unavailable ? (
                        <Banner text={"discontinued"} />
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        : filtered}
    </section>
  );
}
export default ContractorsDisplay;
