"use client";
import React, { useState, useEffect } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header5 from "@/components/fontsize/Header5";
import Header2 from "@/components/fontsize/Header2";
import Header4 from "@/components/fontsize/Header4";
import { getQueriedItems } from "@/firebase/actions";
import { HiCheckCircle } from "react-icons/hi2";
import { ContractAmount, Contractor, Currencies, Project, User } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { totalSum } from "@/utils/currencies";
import Loading from "@/components/ui/Loading";

function AmountDisplay({ user }: { readonly user: User | undefined }) {
  const [projectId, setProjectId] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [loading, setLoading] = useState(false);

  const [allProjects, setAllProjects] = useState<Project[]>();
  const [allContractors, setAllContractors] = useState<Contractor[]>();
  const [allCurrencies, setAllCurrencies] = useState<Currencies[]>();
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

  // GETS ALL PROJECT AND CONTRACTOR NAMES BASED ON THE USER'S TEAM ID
  async function allData() {
    if (!user) {
      return;
    }

    const projectq = query(
      collection(db, "projects"),
      where("team_id", "==", user?.team_id)
    );

    const contractorq = query(
      collection(db, "contractors"),
      where("team_id", "==", user?.team_id)
    );

    const currencyq = query(
      collection(db, "currencies"),
      where("team_id", "==", user?.team_id)
    );

    const projects = await getQueriedItems(projectq);
    const contractors = await getQueriedItems(contractorq);
    const currencies = await getQueriedItems(currencyq);

    projects?.length && setAllProjects(projects as Project[]);

    contractors?.length && setAllContractors(contractors as Contractor[]);

    currencies?.length && setAllCurrencies(currencies as Currencies[]);
  }

  useEffect(() => {
    allData();
  }, [user?.id ?? "guest"]);

  async function totalAmount() {
    // Set submitted values
    projectId.length &&
      contractorId.length &&
      currencyId.length &&
      setSubmit({
        project: projectId,
        contractor: contractorId,
        currency: currencyId,
      });

    // Find the symbol for the selected/submitted currency
    const symbol = currency_list.find((item) => item.name === submit.currency);
    symbol && setCurrencySymbol(symbol?.symbol);

    setLoading(true);

    // Get queried contracts based on project_id and contractor_id
    const contractq = query(
      collection(db, "contracts"),
      where("project_id", "==", submit.project),
      where("contractor_id", "==", submit.contractor),
    );
    
    const allContracts = await getQueriedItems(contractq)
    
    let contractWithCurrencies: ContractAmount[] = [];

    allContracts?.length && allContracts?.forEach(async (item) => {
      // Getting all contract amounts where the currency_id in subcollection 
      // matches the selected option
      const amountq = query(
        collection(db, "contracts", item?.id, "contractAmount"),
        where("currency_id", "==", submit.currency),
      );

      const amount = await getQueriedItems(amountq)

      if (!amount?.length) {
        return;
      }

      contractWithCurrencies = amount as ContractAmount[]
    })

    
    // Get queried payments within contracts
    const contractpaymentq = query(
      collection(db, "payments"),
      where("project_id", "==", submit.project),
      where("contractor_id", "==", submit.contractor),
      where("currency_id", "==", submit.currency),
      where("contract_id", "!=", null)
    );

    // Get queried payments outside of contracts
    const noncontractpaymentq = query(
      collection(db, "payments"),
      where("project_id", "==", submit.project),
      where("contractor_id", "==", submit.contractor),
      where("currency_id", "==", submit.currency),
      where("contract_id", "==", null)
    );


    const contractpaymentQuery = await getQueriedItems(contractpaymentq);
    const noncontractpaymentQuery = await getQueriedItems(noncontractpaymentq);


    const contractPayments: number[] = [];
    const noncontractPayments: number[] = [];
    const contracts: number[] = [];

    // Only push the amount to the array
    contractpaymentQuery?.forEach((item) => {
      contractPayments.push(item?.amount)
    });

    noncontractpaymentQuery?.forEach((item) => {
      contractPayments.push(item?.amount)
    });

    contractWithCurrencies?.forEach((item) => {
      contracts.push(item?.amount)
    })
    
    let contractTotals;
    let contractPaymentsTotals;
    let noncontractPaymentsTotals;

    contractTotals = totalSum(contracts);
    contractPaymentsTotals = totalSum(contractPayments);
    noncontractPaymentsTotals = totalSum(noncontractPayments);

    setAllTotals({
      contractPayments: contractPaymentsTotals,
      contracts: contractTotals,
      noncontractPayments: noncontractPaymentsTotals,
    });

    setLoading(false);
  }

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
          valueChange={setProjectId}
          value="Select a project"
          label="Projects"
        >
          {allProjects?.length
            ? allProjects.map((item) => {
                return (
                  <SelectItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          valueChange={setContractorId}
          value="Select a contractor"
          label="Contractors"
        >
          {allContractors?.length
            ? allContractors.map((item) => {
                return (
                  <SelectItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          valueChange={setCurrencyId}
          value="Select a currency"
          label="Currencies"
        >
          {allCurrencies?.map((item) => {
            return (
              <SelectItem
                className="cursor-pointer"
                key={item?.id}
                value={item?.id}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectBar>
        <button
          onClick={totalAmount}
          className={`${
            !contractorId.length ||
            !projectId.length ||
            !currencyId.length
              ? "opacity-70 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
          disabled={
            !contractorId.length ||
            !projectId.length ||
            !currencyId.length
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
