"use client";
import React, { Fragment } from "react";
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
import { CreateProjectSchema } from "@/zod/validation";
import { toast } from "@/hooks/use-toast";
import { addItem } from "@/firebase/actions";
import {
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";

function ProjectDisplay({
  user,
  loading,
  sort,
  searchValue,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly loading: boolean;
}) {
  const [allProjects, setAllProjects] = React.useState<Project[] | undefined>();

  const [projectMonth, setProjectMonth] = React.useState("");
  const [projectCountry, setProjectCountry] = React.useState("");

  const [isClicked, setIsClicked] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  function getProjects() {
    try {
      if (!user) {
        return;
      }

      const projectq = query(
        collection(db, "projects"),
        where("team_id", "==", user?.team_id)
      );

      const projects: Project[] = [];

      const unsub = onSnapshot(projectq, (snap) => {
        snap.forEach((item) => {
          projects.push({ ...(item.data() as Project), id: item?.id });
        });

        setAllProjects(projects);
      });

      return unsub;
    } catch (err: any) {
      console.log(err.message);
    }
  }

  React.useEffect(() => {
    getProjects();
  }, [user?.id ?? "guest"]);

  async function createProject(formData: FormData) {
    const project_name = formData.get("name");
    const project_year = formData.get("year");
    const city_name = formData.get("city");

    const values = {
      name: project_name,
      year: project_year && +project_year,
      month: projectMonth,
      country: projectCountry,
    };

    const result = CreateProjectSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result?.error?.issues[0]?.message,
      });

      return;
    }

    const { name, country, year, month } = result.data;

    try {
      if (!user) {
        return;
      }

      await addItem("projects", {
        name,
        team_id: user?.team_id,
        country,
        city: city_name ?? null,
        start_month: month,
        start_year: year,
        is_ongoing: true,
        created_at: serverTimestamp(),
      });

      setProjectMonth("");
      setProjectCountry("");
      setOpen(false);

      toast({
        variant: "default",
        title: "Project created succesfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err?.message,
      });
    }
  }

  const checkAdmin = user?.is_admin ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* BUTTON TO ADD NEW PROJECT; ONLY ADMIN CAN ADD A NEW PROJECT */}
        <button>
          <Card className="h-[200px] cursor-pointer flex justify-center items-center hover:opacity-80 duration-300 hover:shadow-md">
            <div className="">
              <div className="flex justify-center">
                <Plus strokeWidth={1} className="w-16 h-16 text-lightText" />
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
        <form action={createProject}>
          {/* PROJECT NAME */}
          <Input label="Project name *" htmlFor="name">
            <input name="name" className="form" type="text" />
          </Input>
          <Input label="City" htmlFor="city" className="mt-3">
            <input name="city" className="form" type="text" />
          </Input>
          <div className="flex items-center gap-4 mt-5">
            {/* COUNTRY LOCATION */}
            <SelectBar
              value="Select country *"
              valueChange={setProjectCountry}
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
              value="Starting month *"
              valueChange={setProjectMonth}
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
          <Input label="Starting year *" htmlFor="year" className="flex-1 mt-3">
            <input
              name="year"
              className="form"
              type="number"
              // min={1900}
              // max={new Date().getFullYear()}
            />
          </Input>
          <div className="flex justify-center mt-6 scale-75">
            <Submit setIsClicked={setIsClicked} isClicked={isClicked} />
          </div>
        </form>
        <DialogFooter className=""></DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;

  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {loading
        ? [0, 1, 2, 3, 4, 5].map((each, i) => {
            return (
              <Fragment key={`${each}_${i}`}>
                <Skeleton className="h-[200px] rounded-[40px]" />
              </Fragment>
            );
          })
        : checkAdmin}
      {allProjects
        ? allProjects.map((item) => {
            return (
              <Link href={`/projects/${item?.id}`} key={item.id}>
                <Card className="h-[200px] z-0 cursor-pointer hover:opacity-80 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <Header4 text={item.name} className="capitalize" />
                    <p className="text-[14px] text-light70">
                      Since {item?.start_month?.substring(0, 3)}.{" "}
                      {item.start_year} -{" "}
                      {item?.city ? <span className="italic">`${item.city}, `</span> : null}
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
        : null}
    </div>
  );
}

export default ProjectDisplay;
