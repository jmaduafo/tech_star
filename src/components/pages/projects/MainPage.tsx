"use client";
import React, { useState } from "react";
import AuthContainer from "../AuthContainer";
import { useAuth } from "@/context/AuthContext";
import ProjectCard from "./ProjectCard";
import ProjectSearch from "./ProjectSearch";

function MainPage() {
  const { userData, loading } = useAuth();
  const [activity, setActivity] = useState("");
  const [searchValue, setSearchValue] = useState("");

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[80%] mx-auto">
        <ProjectSearch
          user={userData}
          setActivity={setActivity}
          setValue={setSearchValue}
          value={searchValue}
        />
        <div className="mt-10">
          <ProjectCard user={userData} activity={activity} />
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
