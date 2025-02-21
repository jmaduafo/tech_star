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

function MainPage() {
  const [projectName, setProjectName] = React.useState("");
  const [contractorName, setContractorName] = React.useState("");
  const [contractorData, setContractorData] = React.useState<Contract[] | undefined>();
  const [nonContractorData, setNonContractorData] = React.useState<Payment[] | undefined>();

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

  async function getContracts() {
    if (!userData || !contractor_id) {
      return;
    }

    const contractq = query(collection(db, "contracts"), where("contractor_id", "==", contractor_id))
    

    const contracts: Contract[] = []

    const unsub = onSnapshot(contractq, (snap) => {
      snap.forEach(item => {
        contracts.push({... item.data() as Contract, id: item.id})
      })
      setContractorData(contracts)
    })

    return unsub()

  }
  async function getNonContracts() {
    if (!userData || !contractor_id) {
      return;
    }

    const noncontractq = query(collection(db, "payments"), where("contract_id", "==", null), where("contractor_id", "==", contractor_id))

    const noncontracts: Payment[] = []

    const unsub = onSnapshot(noncontractq, (snap) => {
      snap.forEach(item => {
        noncontracts.push({... item.data() as Payment, id: item.id})
      })
      setNonContractorData(noncontracts)
    })

    return unsub()
  }

  React.useEffect(() => {
    getContracts()
    getNonContracts()
  }, [ userData?.id ?? "guest"])

  return (
    <AuthContainer>
      <div className="min-h-[80vh] w-[85%] mx-auto">
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
                    <BreadcrumbLink>{projectName}</BreadcrumbLink>
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
          <Contracts user={userData} data={contractorData}/>
        </div>
        <Separator />
        <div className="mt-8">
          <NonContracts user={userData} data={nonContractorData}/>
        </div>
      </div>
    </AuthContainer>
  );
}

export default MainPage;
