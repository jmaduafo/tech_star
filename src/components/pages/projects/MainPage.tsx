"use client";
import React, { useState, useEffect } from "react";
import AuthContainer from "../AuthContainer";
import { useAuth } from "@/context/AuthContext";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSearch from "./ProjectSearch";
import { db } from "@/firebase/config";
import { Project } from "@/types/types";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import Header1 from "@/components/fontsize/Header1";

function MainPage() {
  const { userData, loading } = useAuth();
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [filterSearch, setFilterSearch] = useState<Project[]>([]);

  function getProjects() {
    try {
      if (!userData) {
        return;
      }

      const projectq = query(
        collection(db, "projects"),
        where("team_id", "==", userData?.team_id)
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

  useEffect(() => {
    getProjects();
  }, [userData?.id ?? "guest"]);

  function filterProjects() {
    allProjects?.length &&
      searchValue.length &&
      setFilterSearch(
        allProjects.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.country?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.city?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

    //   !searchValue.length && allProjects && setFilterSearch(allProjects)
  }

  useEffect(() => {
    filterProjects();
  }, [searchValue]);

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto">
        <div className="flex items-start gap-5 mb-8 text-lightText">
          <Header1 text="All Projects" />
          {allProjects ? (
            <Header6
              text={`${
                allProjects?.length && !filterSearch.length && !searchValue.length
                  ? allProjects?.length : filterSearch.length
              } result${optionalS(
                allProjects?.length && !filterSearch.length && !searchValue.length
                ? allProjects?.length : filterSearch.length
              )}`}
            />
          ) : null}
        </div>
        <ProjectSearch
          user={userData}
          setSort={setSort}
          setValue={setSearchValue}
          value={searchValue}
        />
        <div className="mt-10">
          <ProjectDisplay
            user={userData}
            loading={loading}
            sort={sort}
            searchValue={searchValue}
            allProjects={allProjects}
            filterSearch={filterSearch}
          />
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
