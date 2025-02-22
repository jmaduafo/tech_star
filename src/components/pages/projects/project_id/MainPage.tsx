"use client";
import React from "react";
import AuthContainer from "../../AuthContainer";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDocumentItem } from "@/firebase/actions";
import Header4 from "@/components/fontsize/Header4";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import StagesSearch from "./StagesSearch";
import StagesDisplay from "./StagesDisplay";

function MainPage() {
  const [projectName, setProjectName] = React.useState("");

  const [sort, setSort] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];

  const { userData, loading } = useAuth();

  // GET SELECTED PROJECT NAME TO DISPLAY IN BREADCRUMB DISPLAY
  async function getProjectName() {
    try {
      if (!userData) {
        return;
      }

      const project = await getDocumentItem("projects", project_id);

      setProjectName(project?.name);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  React.useEffect(() => {
    getProjectName();
  }, [userData?.id ?? "guest"]);

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-5 mb-8 text-lightText">
            <Header1 text="All Stages" />
            <Header6 text={`3 results`} />
          </div>
          <Link href={`/projects/${project_id}/contractors`}>
            <div className="flex items-center gap-3 group">
              <Header4
                text="Contractors"
                className="group-hover:translate-x-[-5px] duration-300"
              />
              <ChevronRight strokeWidth={1} className="" />
            </div>
          </Link>
        </div>
        {/* BREADCRUMB DISPLAY */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {projectName.length ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{projectName}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* CONTRACTOR SEARCH BAR */}
        <StagesSearch
          user={userData}
          setSort={setSort}
          setValue={setSearchValue}
          value={searchValue}
        />
        {/* DISPLAY OF CONTRACTORS AND ALLOWS ONLY ADMIN TO ADD CONTRACTOR */}
        <div className="mt-10">
          <StagesDisplay
            user={userData}
            loading={loading}
            projectId={project_id}
            sort={sort}
            searchValue={searchValue}
          />
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
