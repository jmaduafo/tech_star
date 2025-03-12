"use client";
import AuthContainer from "@/components/pages/AuthContainer";
import React from "react";
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
import { getDocumentItem } from "@/firebase/actions";
import { useAuth } from "@/context/AuthContext";
import Separator from "@/components/ui/Separator";
import { db } from "@/firebase/config";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { Contract, Payment } from "@/types/types";
import ContentContainer from "@/components/pages/ContentContainer";
import AddButton from "@/components/ui/buttons/AddButton";
import Input from "@/components/ui/input/Input";

function MainPage() {
  const [projectName, setProjectName] = React.useState("");
  const [contractorName, setContractorName] = React.useState("");
  const [contractorData, setContractorData] = React.useState<
    Contract[] | undefined
  >();
  const [nonContractorData, setNonContractorData] = React.useState<
    Payment[] | undefined
  >();

  const pathname = usePathname();
  const project_id = pathname.split("/")[2];
  const contractor_id = pathname.split("/").pop();

  const { userData, loading } = useAuth();

  async function getProjectAndContractorNames() {
    if (!project_id || !contractor_id) {
      return;
    }

    const proj = await getDocumentItem("projects", project_id);
    const contr = await getDocumentItem("contractors", contractor_id);

    setProjectName(proj?.name);
    setContractorName(contr?.name);
  }

  React.useEffect(() => {
    getProjectAndContractorNames();
  }, [projectName, contractorName]);

  // RETRIEVE
  function getContracts() {
    if (!userData || !contractor_id) {
      return;
    }

    const contractq = query(
      collection(db, "contracts"),
      where("contractor_id", "==", contractor_id)
    );

    const contracts: Contract[] = [];

    const unsub = onSnapshot(contractq, (snap) => {
      snap.forEach((item) => {
        contracts.push({ ...(item.data() as Contract), id: item.id });
      });
      setContractorData(contracts);
    });

    return unsub;
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
      const noncontracts: Payment[] = snap.docs.map((doc) => ({
        ...(doc.data() as Payment),
        id: doc.id,
      }));
      setNonContractorData(noncontracts);
    });

    return nonUnsub;
  }

  React.useEffect(() => {
    const unsub = getContracts();
    const nonUnsub = getContracts();

    getNonContracts();

    return () => {
      unsub && unsub();
      nonUnsub && nonUnsub();
    };
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
            <Header6 text={`3 results`} />
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
            contractorName={contractorName}
            projectName={projectName}
          />
        </div>
        <Separator />
        <div className="mt-8">
          <NonContracts
            user={userData}
            data={nonContractorData}
            contractorName={contractorName}
            projectName={projectName}
          />
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
