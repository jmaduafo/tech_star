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
  onSnapshot
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
import { getDocumentItem } from "@/firebase/actions";

function MainPage() {
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  const [contract, setContract] = useState<Contract | undefined>();

  const [projectName, setProjectName] = useState<string | undefined>();
  const [contractorName, setContractorName] = useState<string | undefined>();

  const { userData } = useAuth();
  const params = useParams();

  const projectId = params.project_id ?? "";
  const contractorId = params.contractor_id ?? "";
  const contractId = params.contract_id ?? "";

  const getAllData = async () => {
    if (
      !userData ||
      !projectId ||
      typeof projectId !== "string" ||
      !contractId ||
      typeof contractId !== "string" ||
      !contractorId ||
      typeof contractorId !== "string"
    ) {
      return;
    }

    const [project, contractor, contract] = await Promise.all([
      getDocumentItem("projects", projectId),
      getDocumentItem("contractors", contractorId),
      getDocumentItem("contracts", contractId),
    ]);

    setProjectName(project ? project?.name : undefined);
    setContractorName(contractor ? contractor?.name : undefined);
    setContract(contract as Contract);

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
  };

  useEffect(() => {
    getAllData();
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
            {contract ? (
              <Banner text={contract.is_completed ? "completed" : "ongoing"} />
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
          projectId={projectId}
          contractorId={contractorId}
          contract={contract}
        />
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
