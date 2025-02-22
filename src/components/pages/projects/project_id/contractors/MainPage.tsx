"use client";
import React, { useState } from "react";
import AuthContainer from "@/components/pages/AuthContainer";
import ContractorsSearch from "./ContractorsSearch";
import ContractorsDisplay from "./ContractorsDisplay";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { Contractor } from "@/types/types";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import Header1 from "@/components/fontsize/Header1";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { getDocumentItem } from "@/firebase/actions";

function MainPage() {
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [allContractors, setAllContractors] = React.useState<
    Contractor[] | undefined
  >();
  const [filterSearch, setFilterSearch] = React.useState<Contractor[]>([]);

  const [projectName, setProjectName] = React.useState("");

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];

  const { userData, loading } = useAuth();

  // GET ALL CONTRACTORS BY USER'S TEAM
  async function getContractors() {
    try {
      if (!userData || !project_id) {
        return;
      }

      const contractorq = query(
        collection(db, "contractors"),
        where("team_id", "==", userData?.team_id),
        where("project_id", "==", project_id)
      );

      const contractors: Contractor[] = [];

      const unsub = onSnapshot(contractorq, (snap) => {
        snap.forEach((item) => {
          contractors.push({ ...(item.data() as Contractor), id: item?.id });
        });

        setAllContractors(contractors);
      });

      return unsub;
    } catch (err: any) {
      console.log(err.message);
    }
  }

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
    getContractors();
  }, [userData?.id ?? "guest"]);

  // FILTER CONTRACTOR NAME BY SEARCHED VALUE
  function filterContractors() {
    allContractors?.length &&
      searchValue.length &&
      setFilterSearch(
        allContractors.filter((item) =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
  }

  React.useEffect(() => {
    filterContractors();
  }, [searchValue]);

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto relative">
        <div className="flex items-start gap-5 mb-2">
          <Header1 text="All Contractors" />
          {allContractors ? (
            <Header6
              text={`${
                allContractors?.length &&
                !filterSearch.length &&
                !searchValue.length
                  ? allContractors?.length
                  : filterSearch.length
              } result${optionalS(
                allContractors?.length &&
                  !filterSearch.length &&
                  !searchValue.length
                  ? allContractors?.length
                  : filterSearch.length
              )}`}
            />
          ) : null}
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
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/projects/${project_id}`}>{projectName}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : null}
              <BreadcrumbItem>
                <BreadcrumbPage>Contractors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* CONTRACTOR SEARCH BAR */}
        <ContractorsSearch
          user={userData}
          setSort={setSort}
          setValue={setSearchValue}
          value={searchValue}
        />
        {/* DISPLAY OF CONTRACTORS AND ALLOWS ONLY ADMIN TO ADD CONTRACTOR */}
        <div className="mt-10">
          <ContractorsDisplay
            user={userData}
            loading={loading}
            projectId={project_id}
            sort={sort}
            searchValue={searchValue}
            allContractors={allContractors}
            filterSearch={filterSearch}
          />
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
