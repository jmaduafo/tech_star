"use client";
import React, { useState } from "react";
import AuthContainer from "@/components/pages/AuthContainer";
import ContractorsSearch from "./ContractorsSearch";
import ContractorsDisplay from "./ContractorsDisplay";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { Contractor } from "@/types/types";
import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
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

function MainPage() {
  const { userData, loading } = useAuth();
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [allContractors, setAllContractors] = React.useState<
    Contractor[] | undefined
  >();
  const [filterSearch, setFilterSearch] = React.useState<Contractor[]>([]);

  const [projectName, setProjectName] = React.useState("");

  const pathname = usePathname();

  function getContractors() {
    try {
      if (!userData) {
        return;
      }

      const contractorq = query(
        collection(db, "contractors"),
        where("team_id", "==", userData?.team_id)
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

  console.log(sort)

  async function getProjectName() {
    const project_id = pathname.split("/")[2];
    
    try {
      if (!userData) {
        return;
      }

      const projectNameq = doc(db, "projects", project_id);

      const projectDoc = await getDoc(projectNameq);

      if (!projectDoc?.exists()) {
        return;
      }

      setProjectName(projectDoc?.data()?.name);
    } catch (err: any) {
      console.log(err.message);
    }
  }
  
  
  React.useEffect(() => {
    getProjectName();
    getContractors();
  }, [userData?.id ?? "guest"]);

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
      <div className="min-h-[80vh] w-[85%] mx-auto">
        <div className="flex items-start gap-5 mb-2 text-lightText">
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
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {projectName ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Kilimanjaro</BreadcrumbLink>
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
        <ContractorsSearch
          user={userData}
          setSort={setSort}
          setValue={setSearchValue}
          value={searchValue}
        />
        <div className="mt-10">
          <ContractorsDisplay
            user={userData}
            loading={loading}
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
