"use client";
import React, { Fragment, useActionState, useEffect } from "react";
import { Project, User } from "@/types/types";
import Card from "@/components/ui/MyCard";
import { Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, months } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { createProject } from "@/zod/actions";

function ProjectDisplay({
  user,
  sort,
  searchValue,
  allProjects,
  filterSearch,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly allProjects: Project[] | undefined;
  readonly filterSearch: Project[];
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      createProject(prevState, formData, {
        id: user?.id as string,
        team_id: user?.team_id as string,
      }),
    {
      data: {
        month: "",
        city: "",
        country: "",
        name: "",
        year: "",
      },
      message: "",
      success: false,
    }
  );

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (!state?.success && state?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title: "Project was created successfully!",
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
                <Header5 text="Add new project" className="text-center" />
              </div>
            </Card>
          </button>
        </DialogTrigger>
        {/* CREATE PROJECT DIALOG POPUP */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a project</DialogTitle>
            <DialogDescription>
              Start a project and manage finances
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            {/* PROJECT NAME */}
            <Input label="Project name *" htmlFor="name">
              <input
                name="name"
                className="form"
                type="text"
                defaultValue={state?.data?.name}
              />
            </Input>
            <Input label="City" htmlFor="city" className="mt-3">
              <input
                name="city"
                className="form"
                type="text"
                defaultValue={state?.data?.city}
              />
            </Input>
            <div className="flex items-center gap-4 mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select country *"
                defaultValue={state?.data?.country}
                label="Countries"
                className="flex-1"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              <SelectBar
                placeholder="Starting month *"
                defaultValue={state?.data?.month}
                label="Months"
                className="flex-1"
              >
                {months.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <Input
              label="Starting year *"
              htmlFor="year"
              className="flex-1 mt-3"
            >
              <input
                name="year"
                className="form"
                type="number"
                defaultValue={state?.data?.year}
              />
            </Input>
            <div className="flex justify-center mt-6 scale-75">
              <Submit loading={isLoading} />
            </div>
          </form>
          <DialogFooter className=""></DialogFooter>
        </DialogContent>
      </Dialog>
    ) : null;

  const filtered =
    filterSearch?.length && searchValue.length
      ? filterSearch.map((item) => {
          return (
            <Link href={`/projects/${item?.id}`} key={item.id}>
              <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-90 duration-300 hover:shadow-md">
                <div className="flex flex-col h-full">
                  <Header4 text={item.name} className="capitalize" />
                  <p className="text-[14px] text-light50">
                    Since {item?.start_month?.substring(0, 3)}.{" "}
                    {item.start_year} -{" "}
                    {item?.city ? (
                      <span className="italic">`${item.city}, `</span>
                    ) : null}
                    <span className="italic">{item.country}</span>
                  </p>
                  <div className="mt-auto">
                    <Banner text={item.is_ongoing ? "ongoing" : "completed"} />
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
      {allProjects?.length && !filterSearch.length && !searchValue.length
        ? allProjects?.map((item) => {
            return (
              <Link href={`/projects/${item?.id}`} key={item.id}>
                <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-90 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <Header4 text={item.name} className="capitalize" />
                    <p className="text-[14px] text-light50">
                      Since {item?.start_month?.substring(0, 3)}.{" "}
                      {item.start_year} -{" "}
                      {item?.city ? (
                        <span className="italic">`${item.city}, `</span>
                      ) : null}
                      <span className="italic">{item.country}</span>
                    </p>
                    <div className="mt-auto">
                      <Banner
                        text={item.is_ongoing ? "ongoing" : "completed"}
                      />
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

export default ProjectDisplay;
