import AuthContainer from "@/components/pages/AuthContainer";
import React from "react";
import Contracts from "./Contracts";
import NonContracts from "./NonContracts";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

function MainPage() {
  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto">
      <div className="flex items-start gap-5 mb-2 text-lightText">
          <Header1 text="Cappa" />
          {/* {allContractors ? (
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
          ) : null} */}
          <Header6
            text={`3 results`}
          />
        </div>
        {/* BREADCRUMB DISPLAY */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Kilimanjaro</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Contractors</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cappa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Contracts />
        <NonContracts />
      </div>
    </AuthContainer>
  );
}

export default MainPage;
