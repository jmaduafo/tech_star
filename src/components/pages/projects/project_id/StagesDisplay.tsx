"use client";
import React, { Fragment, useState, useEffect } from "react";
import Header4 from "@/components/fontsize/Header4";
import Paragraph from "@/components/fontsize/Paragraph";
import Banner from "@/components/ui/Banner";
import { User, Stage } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical } from "lucide-react";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import { Skeleton } from "@/components/ui/skeleton";
import NotAvailable from "@/components/ui/NotAvailable";
import { getAllItems } from "@/firebase/actions";

function StagesDisplay({
  user,
  loading,
  sort,
  searchValue,
  projectId,
  data,
  stageLoading,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly projectId: string;
  readonly searchValue: string;
  readonly loading: boolean;
  readonly stageLoading: boolean;
  readonly data: Stage[] | undefined;
}) {
  const stagesList = data?.length ? (
    data.map((item) => {
      return (
        <Fragment key={item.id}>
          <StageCard item={item} loading={loading} user={user} />
        </Fragment>
      );
    })
  ) : (
    <div className="flex justify-center py-8">
      <NotAvailable text="No stages available" />
    </div>
  );

  return (
    <section>
      {loading
        ? [0, 1, 2, 3].map((each, i) => {
            return (
              <Fragment key={`${each}_${i}`}>
                <Skeleton className="h-[200px] rounded-[40px] mb-5" />
              </Fragment>
            );
          })
        : stagesList}
    </section>
  );
}

export default StagesDisplay;

function StageCard({
  item,
  loading,
  user,
}: {
  readonly loading: boolean;
  readonly item: Stage;
  readonly user: User | undefined;
}) {
  const [values, setValues] = useState({
    name: item.name,
    desc: item.description,
    is_completed: item.is_completed,
  });

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  async function handleEditStage(formData: FormData) {
    const name = formData.get("name")
    const desc = formData.get("desc")
  }

  return (
    <div className="rounded-3xl bg-light10 backdrop-blur-3xl mb-5">
      <div className="flex justify-between items-center rounded-tr-3xl rounded-tl-3xl py-4 px-5 bg-light25">
        <Header4 text={item.name} />
        {/* EDIT BUTTON: ONLY ADMIN CAN EDIT */}
        {user?.is_admin ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <EllipsisVertical strokeWidth={1} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
                <DropdownMenuGroup>
                  <Dialog>
                    <DialogTrigger asChild>
                      <p className="text-sm px-2 py-1 border-r-[1.5px] hover:border-r-darkText">
                        Edit
                      </p>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit stage</DialogTitle>
                        <DialogDescription>
                          Make changes to your stage here. Save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <form action={handleEditStage}>
                        <Input htmlFor="name" label="Stage name">
                          <input
                            name="name"
                            id="name"
                            className="form"
                            type="text"
                            onChange={handleChange}
                            value={values.name}
                          />
                        </Input>
                        <Input
                          htmlFor="desc"
                          label="Description"
                          className="mt-3"
                        >
                          <textarea
                            name="desc"
                            id="desc"
                            className="form"
                            onChange={handleChange}
                            value={values.desc}
                          ></textarea>
                        </Input>
                        <div className="flex justify-center mt-6 scale-75">
                          <Submit loading={loading} />
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
      <div className="py-3 px-5">
        <Paragraph className="w-[80%]" text={item.description} />
        <div className="mt-4 flex justify-end">
          <Banner text={item.is_completed ? "completed" : "ongoing"} />
        </div>
      </div>
    </div>
  );
}
