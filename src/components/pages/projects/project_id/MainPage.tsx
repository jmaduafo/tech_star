"use client";
import React, { useEffect, useState } from "react";
import AuthContainer from "../../AuthContainer";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
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
import {
  getDocumentItem,
} from "@/firebase/actions";
import Header4 from "@/components/fontsize/Header4";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import StagesSearch from "./StagesSearch";
import StagesDisplay from "./StagesDisplay";
import { db } from "@/firebase/config";
import { Stage } from "@/types/types";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { optionalS } from "@/utils/optionalS";
import ContentContainer from "../../ContentContainer";

function MainPage() {
  const [projectName, setProjectName] = useState("");
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [allStages, setAllStages] = useState<Stage[] | undefined>();

  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];

  const { userData } = useAuth();

  const getAllData = async () => {
    setLoading(true);

    try {
      if (!userData) {
        return;
      }

      const project = await getDocumentItem("projects", project_id);

      setProjectName(project?.name);

      const stageq = query(
        collection(db, "stages"),
        where("project_id", "==", project_id),
        where("team_id", "==", userData?.team_id),
        orderBy("created_at", "asc")
      );

      const unsub = onSnapshot(stageq, (doc) => {
        const stages: Stage[] = [];

        doc.forEach((item) => {
          stages.push({ ...(item?.data() as Stage), id: item.id });
        });

        setAllStages(stages);

        return () => unsub();
      });
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, [userData?.id ?? "guest"]);

  return (
    <AuthContainer>
      <ContentContainer>
        <div className="flex justify-between sm:items-center flex-col sm:flex-row">
          <div className="flex items-start gap-5 mb-2 sm:mb-8 text-lightText">
            <Header1 text="All Stages" />
            {allStages ? (
              <Header6
                text={`${allStages?.length} result${optionalS(
                  allStages?.length
                )}`}
              />
            ) : null}
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
        <div className="mt-3 sm:mt-0 mb-8">
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
          projectId={project_id}
        />
        {/* DISPLAY OF CONTRACTORS AND ALLOWS ONLY ADMIN TO ADD CONTRACTOR */}
        <div className="mt-10">
          <StagesDisplay
            user={userData}
            projectId={project_id}
            sort={sort}
            searchValue={searchValue}
            data={allStages}
            stageLoading={loading}
          />
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
