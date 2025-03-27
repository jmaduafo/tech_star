"use client";
import React, { useState, useEffect } from "react";
import AuthContainer from "@/components/pages/AuthContainer";
import ContentContainer from "@/components/pages/ContentContainer";
import { Contract, Payment } from "@/types/types";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";
import { useParams } from "next/navigation";
import Payments from "./Payments";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Banner from "@/components/ui/Banner";

function MainPage() {
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  const [projectName, setProjectName] = useState<string | undefined>();
  const [contractorName, setContractorName] = useState<string | undefined>();
  const [contract, setContract] = useState<Contract | undefined>();
  const [stageName, setStageName] = useState<string | undefined>();
  const [stageId, setStageId] = useState<string | undefined>();

  const { userData } = useAuth();
  const params = useParams();

  const projectId = params.project_id ?? "";
  const contractorId = params.contractor_id ?? "";
  const contractId = params.contract_id ?? "";

  function getPayments() {
    try {
      if (!userData) {
        return;
      }

      const paymentq = query(
        collection(db, "payments"),
        where("team_id", "==", userData?.team_id),
        where("project_id", "==", projectId),
        where("contractor_id", "==", contractorId),
        where("contract_id", "==", contractId)
      );

      const unsub = onSnapshot(paymentq, (snap) => {
        const payments: Payment[] = [];

        snap.docs.forEach((doc) => {
          payments.push({ ...(doc.data() as Payment), id: doc.id });
        });

        setAllPayments(payments);

        return () => unsub();
      });
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function getProjectName() {
    try {
      if (!userData || typeof projectId !== "string") {
        return;
      }

      const projectq = doc(db, "projects", projectId);

      const docSnap = await getDoc(projectq);

      docSnap?.exists()
        ? setProjectName(docSnap?.data()?.name)
        : setProjectName(undefined);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function getContractorName() {
    try {
      if (!userData || typeof contractorId !== "string") {
        return;
      }

      const contractorq = doc(db, "contractors", contractorId);

      const docSnap = await getDoc(contractorq);

      docSnap?.exists()
        ? setContractorName(docSnap?.data()?.name)
        : setContractorName(undefined);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function getContractInfo() {
    try {
      if (!userData || typeof contractId !== "string") {
        return;
      }

      const contractq = doc(db, "contracts", contractId);

      const docSnap = await getDoc(contractq);

      if (docSnap?.exists()) {
        setContract(docSnap?.data() as Contract);
        setStageId(docSnap?.data()?.stage_id)
        setStageName(docSnap?.data()?.stage_name)
      } else {
        setContract(undefined);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getPayments();
    getProjectName();
    getContractorName();
    getContractInfo();
  }, [userData?.id ?? "guest"]);

  return (
    <AuthContainer>
      <ContentContainer>
        <div className="">
          <div className="flex items-start gap-5 mb-2 text-lightText">
            {contract ? <Header1 text={contract.contract_code} /> : null}
            {allPayments ? (
              <Header6
                text={`${allPayments.length} result${optionalS(
                  allPayments.length
                )}`}
              />
            ) : null}
          </div>
          <div className="mb-3">
            {contract ? <Banner text={contract.is_completed ? "completed" : "ongoing"}/> : null}
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
              {projectName ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/projects/${projectId}`}>
                      {projectName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : null}
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${projectId}/contractors`}>
                  Contractors
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/projects/${projectId}/contractors/${contractorId}`}
                >
                  {contractorName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {contract ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{contract.contract_code}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Payments
          user={userData}
          data={allPayments}
          stageId={stageId}
          stageName={stageName}
          projectName={projectName}
          projectId={projectId}
          contractorId={contractorId}
          contractId={contractId}
          contractorName={contractorName}
          contractCode={contract ? contract.contract_code : ""}
          contractDesc={contract ? contract.description : ""}
        />
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
