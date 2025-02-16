import React, { Fragment } from "react";
import { User } from "@/types/types";
import Card from "@/components/ui/MyCard";
import { Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectDisplay({
  user,
  sort,
  loading,
  searchValue
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly loading: boolean;
}) {
  const projects = [
    {
      name: "Peach & Lemons",
      location: "United States",
      year: 2018,
      isCompleted: false,
    },
    {
      name: "Wash Riot",
      location: "France",
      year: 2010,
      isCompleted: true,
    },
    {
      name: "Dolly Parton",
      location: "United States",
      year: 2019,
      isCompleted: false,
    },
    {
      name: "Whachuri",
      location: "China",
      year: 2012,
      isCompleted: true,
    },
  ];


  const checkAdmin = user?.is_admin ? (
    <Link href="/projects/create">
      <Card className="h-[200px] cursor-pointer flex justify-center items-center hover:opacity-80 duration-300 hover:shadow-md">
        <div className="">
          <div className="flex justify-center">
            <Plus strokeWidth={1} className="w-16 h-16 text-lightText" />
          </div>
          <Header5 text="Add new project" className="text-center" />
        </div>
      </Card>
    </Link>
  ) : null;

  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {/* BUTTON TO ADD NEW PROJECT; ONLY ADMIN CAN ADD A NEW PROJECT */}
      {loading ? <Skeleton className="h-[200px]" /> : checkAdmin}

      {projects.map((item) => {
        return (
          <Fragment key={item.name}>
            <Card className="h-[200px] cursor-pointer hover:opacity-80 duration-300 hover:shadow-md">
              <div className="flex flex-col h-full">
                <Header4 text={item.name} />
                <p className="text-[14px] text-light70">
                  Since {item.year} -{" "}
                  <span className="italic">{item.location}</span>
                </p>
                <div className="mt-auto">
                  <Banner text={item.isCompleted ? "completed" : "ongoing"} />
                </div>
              </div>
            </Card>
          </Fragment>
        );
      })}
    </div>
  );
}

export default ProjectDisplay;
