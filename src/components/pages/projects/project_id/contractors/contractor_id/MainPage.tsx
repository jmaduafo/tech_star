"use client";
import AuthContainer from "@/components/pages/AuthContainer";
import React, { useState, useEffect } from "react";
import Contracts from "./Contracts";
import NonContracts from "./NonContracts";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getDocumentItem, getQueriedItems } from "@/firebase/actions";
import { useAuth } from "@/context/AuthContext";
import Separator from "@/components/ui/Separator";
import { db } from "@/firebase/config";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Contract, Payment, Stage } from "@/types/types";
import ContentContainer from "@/components/pages/ContentContainer";
import { optionalS } from "@/utils/optionalS";

function MainPage() {
  const [projectName, setProjectName] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [contractorData, setContractorData] = useState<
    Contract[] | undefined
  >();
  const [nonContractorData, setNonContractorData] = useState<
    Payment[] | undefined
  >();
  const [stagesData, setStagesData] = useState<Stage[] | undefined>();

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];
  const contractor_id = pathname.split("/").pop();

  const { userData } = useAuth();

  async function getProjectAndContractorNames() {
    if (!project_id || !contractor_id) {
      return;
    }

    const proj = await getDocumentItem("projects", project_id);
    const contr = await getDocumentItem("contractors", contractor_id);

    setProjectName(proj?.name);
    setContractorName(contr?.name);
  }

  useEffect(() => {
    getProjectAndContractorNames();
  }, [projectName, contractorName]);

  // RETRIEVE ALL STAGES
  async function getStages() {
    if (!userData || !project_id) {
      return;
    }

    const stageq = query(
      collection(db, "stages"),
      where("project_id", "==", project_id),
      where("team_id", "==", userData?.team_id),
      orderBy("created_at")
    );

    const stageData = await getQueriedItems(stageq);

    setStagesData(stageData as Stage[]);
  }

  // RETRIEVE ALL CONTRACTS
  function getContracts() {
    if (!userData || !contractor_id) {
      return;
    }

    const contractq = query(
      collection(db, "contracts"),
      where("contractor_id", "==", contractor_id)
    );

    const unsub = onSnapshot(contractq, (snap) => {
      const contracts: Contract[] = [];

      snap.forEach((doc) => {
        contracts.push({ ...(doc.data() as Contract), id: doc.id });
      });

      setContractorData(contracts);

      return () => unsub();
    });
  }

  // RETRIEVE ALL NON-CONTRACTS
  function getNonContracts() {
    if (!userData || !contractor_id) {
      return;
    }

    const noncontractq = query(
      collection(db, "payments"),
      where("contract_id", "==", null),
      where("contractor_id", "==", contractor_id)
    );

    const nonUnsub = onSnapshot(noncontractq, (snap) => {
      const noncontracts: Payment[] = [];

      snap.forEach((doc) => {
        noncontracts.push({ ...(doc.data() as Payment), id: doc.id });
      });

      setNonContractorData(noncontracts);

      return () => nonUnsub();
    });

  }

  React.useEffect(() => {
    getNonContracts();
    getContracts();
    getStages();
  }, [userData?.id ?? "guest"]);

  return (
    <AuthContainer>
      <ContentContainer>
        <div className="">
          <div className="flex items-start gap-5 mb-2 text-lightText">
            {contractorName.length ? <Header1 text={contractorName} /> : null}
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
            {contractorData && nonContractorData ? (
              <Header6
                text={`${
                  contractorData.length + nonContractorData.length
                } result${optionalS(
                  contractorData.length + nonContractorData.length
                )}`}
              />
            ) : null}
          </div>
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
                <BreadcrumbLink href={`/projects/${project_id}/contractors`}>
                  Contractors
                </BreadcrumbLink>
              </BreadcrumbItem>
              {contractorName.length ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{contractorName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mb-8">
          <Contracts
            user={userData}
            data={contractorData}
            stagesData={stagesData}
            contractorName={contractorName}
            projectName={projectName}
            contractorId={contractor_id}
            projectId={project_id}
          />
        </div>
        <Separator />
        <div className="mt-8">
          <NonContracts
            user={userData}
            data={nonContractorData}
            stagesData={stagesData}
            contractorName={contractorName}
            projectName={projectName}
            contractorId={contractor_id}
            projectId={project_id}
          />
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
