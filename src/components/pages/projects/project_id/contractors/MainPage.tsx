"use client";
import React, { useEffect, useState } from "react";
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
import ContentContainer from "@/components/pages/ContentContainer";

function MainPage() {
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [projectName, setProjectName] = useState("");

  const [allContractors, setAllContractors] = useState<
    Contractor[] | undefined
  >();
  const [filterSearch, setFilterSearch] = useState<Contractor[]>([]);

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];

  const { userData } = useAuth();

  const getAllData = async () => {
    try {
      if (!userData || !project_id) {
        return;
      }

      const project = await getDocumentItem("projects", project_id);

      setProjectName(project?.name);

      const contractorq = query(
        collection(db, "contractors"),
        where("team_id", "==", userData?.team_id),
        where("project_id", "==", project_id)
      );

      const unsub = onSnapshot(contractorq, (snap) => {
        const contractors: Contractor[] = [];

        snap.forEach((item) => {
          contractors.push({ ...(item.data() as Contractor), id: item?.id });
        });

        setAllContractors(contractors);

        return () => unsub();
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllData()
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

  useEffect(() => {
    filterContractors();
  }, [searchValue]);

  return (
    <AuthContainer>
      <ContentContainer>
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
                    <BreadcrumbLink href={`/projects/${project_id}`}>
                      {projectName}
                    </BreadcrumbLink>
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
          sort={sort}
          setValue={setSearchValue}
          value={searchValue}
        />
        {/* DISPLAY OF CONTRACTORS AND ALLOWS ONLY ADMIN TO ADD CONTRACTOR */}
        <div className="mt-10">
          <ContractorsDisplay
            user={userData}
            projectId={project_id}
            sort={sort}
            searchValue={searchValue}
            allContractors={allContractors}
            filterSearch={filterSearch}
          />
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
