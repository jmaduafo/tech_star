"use client";
import React, { Fragment, useActionState, useEffect, useState } from "react";
import Header4 from "@/components/fontsize/Header4";
import Paragraph from "@/components/fontsize/Paragraph";
import Banner from "@/components/ui/Banner";
import { User, Stage } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVertical } from "lucide-react";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import { Skeleton } from "@/components/ui/skeleton";
import NotAvailable from "@/components/ui/NotAvailable";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { editStage } from "@/zod/actions";

function StagesDisplay({
  user,
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
  readonly stageLoading: boolean;
  readonly data: Stage[] | undefined;
}) {
  const stagesList = data?.length ? (
    data.map((item) => {
      return (
        <Fragment key={item.id}>
          <StageCard item={item} user={user} />
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
      {stageLoading
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
  user,
}: {
  readonly item: Stage;
  readonly user: User | undefined;
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      editStage(prevState, formData, { id: item?.id }),
    {
      message: "",
      success: false,
    }
  );

  const [open, setOpen] = useState(false);
  const [stageInfo, setStageInfo] = useState({
    name: "",
    desc: "",
    is_completed: false,
  });

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

  useEffect(() => {
    if (item) {
      setStageInfo({
        name: item?.name ?? "",
        desc: item?.description ?? "",
        is_completed: item?.is_completed ?? false,
      });
    }
  }, [item]);

  return (
    <div className="rounded-3xl bg-light10 backdrop-blur-3xl mb-5">
      <div className="flex justify-between items-center rounded-tr-3xl rounded-tl-3xl py-4 px-5 bg-light25">
        <Header4 text={item.name} />
        {/* EDIT BUTTON: ONLY ADMIN CAN EDIT */}
        {user?.is_owner || user?.role === "admin" || user?.role === "editor" ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <EllipsisVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit stage</DialogTitle>
                  <DialogDescription>
                    Make changes to your stage here. Save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <form action={action}>
                  <Input htmlFor="name" label="Stage name">
                    <input
                      name="name"
                      id="name"
                      className="form"
                      type="text"
                      value={stageInfo.name}
                      onChange={(e) =>
                        setStageInfo({ ...stageInfo, name: e.target.value })
                      }
                    />
                  </Input>
                  <Input htmlFor="desc" label="Description" className="mt-3">
                    <textarea
                      name="desc"
                      id="desc"
                      className="form"
                      value={stageInfo.desc}
                      onChange={(e) =>
                        setStageInfo({ ...stageInfo, desc: e.target.value })
                      }
                      maxLength={160}
                    ></textarea>
                  </Input>
                  <Paragraph className="text-right text-dark75" text={`${stageInfo.desc.length}/160`}/>
                  <div className="flex items-center gap-2 mt-3">
                    <Switch
                      id="is_completed"
                      name="is_completed"
                      checked={stageInfo.is_completed}
                      onCheckedChange={(text) => {
                        setStageInfo({ ...stageInfo, is_completed: text });
                      }}
                    />
                    <label htmlFor="is_completed">Completed?</label>
                  </div>
                  {/* SUBMIT BUTTON */}
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
              </DialogContent>
            </Dialog>
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
