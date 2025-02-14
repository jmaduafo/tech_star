"use client";
import React, { useState, useEffect } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header5 from "@/components/fontsize/Header5";
import Header2 from "@/components/fontsize/Header2";
import Header4 from "@/components/fontsize/Header4";
import { getAllItems, getQueriedItems } from "@/firebase/actions";
import { HiCheckCircle } from "react-icons/hi2";
import { Contractor, Project } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { totalSum } from "@/utils/currencies";
import Loading from "@/components/ui/Loading";

function AmountDisplay() {
  const [projectName, setProjectName] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [currencyTitle, setCurrencyTitle] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [loading, setLoading] = useState(false);

  const [allProjects, setAllProjects] = useState<Project[]>();
  const [allContractors, setAllContractors] = useState<Contractor[]>();
  const [submit, setSubmit] = useState({
    project: "",
    contractor: "",
    currency: "",
  });

  const [allTotals, setAllTotals] = useState({
    noncontractPayments: 0,
    contractPayments: 0,
    contracts: 0,
  });

  async function totalAmount() {
    projectName.length &&
      contractorName.length &&
      currencyTitle.length &&
      setSubmit({
        project: projectName,
        contractor: contractorName,
        currency: currencyTitle,
      });

    const symbol = currency_list.find((item) => item.name === submit.currency);
    symbol && setCurrencySymbol(symbol?.symbol);

    setLoading(true);

    const paymentq = query(
      collection(db, "payments"),
      where("project_name", "==", submit.project),
      where("contract_name", "==", submit.contractor),
      where("currency", "==", submit.currency)
    );

    const contractq = query(
      collection(db, "contracts"),
      where("project_name", "==", submit.project),
      where("contract_name", "==", submit.contractor),
      where("currency", "array-contains", submit.currency)
    );

    const paymentQuery = await getQueriedItems(paymentq);
    const contractQuery = await getQueriedItems(contractq);

    const contract: number[] = [];
    const contractPayments: number[] = [];
    const noncontractPayments: number[] = [];

    paymentQuery?.forEach((item) => {
      item?.contract_id
        ? contractPayments.push(item?.amount)
        : noncontractPayments.push(item?.amount);
    });

    contractQuery?.forEach((item) => {
      const index = item?.currency?.findIndex(
        (i: string | null) => i && i === submit.currency
      );
      contract.push(item?.amount[index]);
    });

    let contractTotals;
    let contractPaymentsTotals;
    let noncontractPaymentsTotals;

    contractTotals = totalSum(contract);
    contractPaymentsTotals = totalSum(contractPayments);
    noncontractPaymentsTotals = totalSum(noncontractPayments);

    setAllTotals({
      contractPayments: contractPaymentsTotals,
      contracts: contractTotals,
      noncontractPayments: noncontractPaymentsTotals,
    });

    setLoading(false);
  }

  async function allData() {
    const projects = await getAllItems("projects");
    const contractors = await getAllItems("contractors");

    contractors?.length && setAllContractors(contractors as Contractor[]);
    projects?.length && setAllProjects(projects as Project[]);
  }

  useEffect(() => {
    allData();
  }, []);

  // The condition to either show the amount display or the "No payments available"
  const amountView =
    allTotals?.contracts &&
    allTotals?.contractPayments &&
    allTotals?.noncontractPayments ? (
      <div className="mt-6 flex justify-between items-end">
        <div>
          <div className="flex items-start gap-3">
            <Header1
              text={(
                allTotals.contractPayments + allTotals.noncontractPayments
              ).toString()}
              className="font-semibold"
            />
            {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
          </div>
          <Header5 text="Total Payment Made" />
        </div>
        <div className="flex gap-16">
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={allTotals.contracts.toString()}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Revised Contracts" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={allTotals.contractPayments.toString()}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Within Contract" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={allTotals.noncontractPayments.toString()}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Outside Contract" />
          </div>
        </div>
      </div>
    ) : (
      <div className="py-6 flex justify-center items-center">
        <NotAvailable text="No payments available" />
        <p></p>
      </div>
    );

    
  return (
    <div className="">
      <div className="flex gap-4">
        <SelectBar
          valueChange={setProjectName}
          value="Select a project"
          label="Projects"
        >
          {allProjects?.length
            ? allProjects.map((item) => {
                return (
                  <SelectItem key={item?.id} value={item?.name}>
                    {item?.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          valueChange={setContractorName}
          value="Select a contractor"
          label="Contractors"
        >
          {allContractors?.length
            ? allContractors.map((item) => {
                return (
                  <SelectItem key={item?.id} value={item?.name}>
                    {item?.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          valueChange={setCurrencyTitle}
          value="Select a currency"
          label="Currencies"
        >
          {currency_list.map((item) => {
            return (
              <SelectItem
                className="cursor-pointer"
                key={item.code}
                value={item.code}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectBar>
        <button
          onClick={totalAmount}
          className={`${
            !contractorName.length ||
            !projectName.length ||
            !currencyTitle.length
              ? "opacity-70 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
          disabled={
            !contractorName.length ||
            !projectName.length ||
            !currencyTitle.length
          }
        >
          <HiCheckCircle className="text-darkText w-7 h-7" />
        </button>
      </div>
      {/* IF NOT LOADING, THEN DISPLAY "amountView" above*/}
      {loading ? (
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      ) : (
        amountView
      )}
    </div>
  );
}

export default AmountDisplay;
