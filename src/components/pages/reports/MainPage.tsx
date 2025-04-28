"use client";
import React, { useRef } from "react";
import AuthContainer from "../AuthContainer";
import ContentContainer from "../ContentContainer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import ActiveContractors from "./monthly_summary/ActiveContractors";
import ActiveProjects from "./monthly_summary/ActiveProjects";
import PaymentTotal from "./monthly_summary/PaymentTotal";
import TopContractor from "./monthly_summary/TopContractor";
import ProjectExpenses from "./expense_overview/ProjectExpenses";
import ContractorExpenses from "./expense_overview/ContractorExpenses";
import ContractorChart from "./breakdown/ContractorChart";
import PaymentChart from "./breakdown/PaymentChart";
import StageChart from "./breakdown/StageChart";
import { useAuth } from "@/context/AuthContext";
import Header3 from "@/components/fontsize/Header3";

function MainPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  const { userData } = useAuth();

  const downloadPDF = async () => {
    const input = reportRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2, // better quality
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("report.pdf");
  };

  return (
    <AuthContainer>
      <ContentContainer>
        {/* MONTHLY SUMMARY */}
        <section>
          <Header3 text="Monthly Summary" />
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ActiveContractors user={userData} />
            <ActiveProjects user={userData} />
            <PaymentTotal user={userData} />
            <TopContractor user={userData} />
          </div>
        </section>
        {/* CHARTS BREAKDOWN */}
        <section className="mt-4">
          <div className="summaryGrid h-[60vh] gap-4">
            <div className="contractor">
              <ContractorChart user={userData} />
            </div>
            <div className="payment">
              <PaymentChart user={userData} />
            </div>
            <div className="stage">
              <StageChart user={userData} />
            </div>
          </div>
        </section>
        {/* EXPENSES OVERVIEW */}
        <section className="mt-4">
          <div>
            <ProjectExpenses user={userData} />
            <ContractorExpenses user={userData} />
          </div>
        </section>
        <Button onClick={downloadPDF} disabled>
          Download as PDF
        </Button>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
