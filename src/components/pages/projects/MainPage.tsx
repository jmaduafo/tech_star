"use client";
import React, { useState } from "react";
import AuthContainer from "../AuthContainer";
import { useAuth } from "@/context/AuthContext";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSearch from "./ProjectSearch";

function MainPage() {
  const { userData, loading } = useAuth();
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto">
        <ProjectSearch
          user={userData}
          setSort={setSort}
          setValue={setSearchValue}
          value={searchValue}
        />
        <div className="mt-10">
          <ProjectDisplay user={userData} sort={sort} />
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
