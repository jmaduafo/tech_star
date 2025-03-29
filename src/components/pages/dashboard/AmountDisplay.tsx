"use client";
import React, { useState, useEffect } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header2 from "@/components/fontsize/Header2";
import Header4 from "@/components/fontsize/Header4";
import { getQueriedItems } from "@/firebase/actions";
import { Contractor, Project, User } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { convertCurrency, totalSum } from "@/utils/currencies";
import Loading from "@/components/ui/Loading";
import Reset from "@/components/ui/buttons/Reset";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Header6 from "@/components/fontsize/Header6";

function AmountDisplay({ user }: { readonly user: User | undefined }) {
  const [projectId, setProjectId] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [loading, setLoading] = useState(false);

  const [allProjects, setAllProjects] = useState<Project[]>();
  const [allContractors, setAllContractors] = useState<Contractor[]>();

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

    const projects = await getQueriedItems(projectq);
    const contractors = await getQueriedItems(contractorq);

    projects?.length && setAllProjects(projects as Project[]);

    contractors?.length && setAllContractors(contractors as Contractor[]);
  }

  useEffect(() => {
    allData();
  }, [user?.id ?? "guest"]);

  async function totalAmount() {
    try {
      setLoading(true);

      const updatedSubmit = {
        project: projectId,
        contractor: contractorId,
        currency: currencyCode,
      };

      setCurrencySymbol(
        currency_list.find((i) => i.code === currencyCode)?.symbol ?? ""
      );

      const [contracts, withinContract, outsideContract] = await Promise.all([
        // RETRIEVE ALL CONTRACTS TO GET THE FIXED AMOUNT BY THE SELECTED CURRENCY CODE
        getQueriedItems(
          query(
            collection(db, "contracts"),
            where("contractor_id", "==", updatedSubmit.contractor),
            where("project_id", "==", updatedSubmit.project),
            where("currency_code", "==", updatedSubmit.currency)
          )
        ),
        // RETRIEVE ALL PAYMENTS WITHIN CONTRACTS BY THE SELECTED CURRENCY CODE
        getQueriedItems(
          query(
            collection(db, "payments"),
            where("contractor_id", "==", updatedSubmit.contractor),
            where("project_id", "==", updatedSubmit.project),
            where("currency_code", "==", updatedSubmit.currency),
            where("contract_code", "!=", null)
          )
        ),
        // RETRIEVE ALL PAYMENTS OUTSIDE CONTRACTS BY THE SELECTED CURRENCY CODE
        getQueriedItems(
          query(
            collection(db, "payments"),
            where("contractor_id", "==", updatedSubmit.contractor),
            where("project_id", "==", updatedSubmit.project),
            where("currency_code", "==", updatedSubmit.currency),
            where("contract_code", "==", null)
          )
        ),
      ]);

      setAllTotals((prevTotals) => ({
        ...prevTotals,
        noncontractPayments: totalSum(
          outsideContract.map((i) => i.currency_amount)
        ),
        contractPayments: totalSum(
          withinContract.map((i) => i.currency_amount)
        ),
        contracts: totalSum(contracts.map((i) => i.currency_amount)),
      }));

    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setContractorId("");
    setProjectId("");
    setCurrencyCode("");
    setCurrencySymbol("");
    setAllTotals({
      contractPayments: 0,
      contracts: 0,
      noncontractPayments: 0,
    });
  }

  // The condition to either show the amount display or the "No payments available"
  const amountView =
    allTotals?.contracts ||
    allTotals?.contractPayments ||
    allTotals?.noncontractPayments ? (
      <div className="mt-6 flex justify-between items-end">
        <div>
          <div className="flex items-start gap-3">
            <Header1
              text={convertCurrency(
                allTotals.contractPayments + allTotals.noncontractPayments
              )}
              className="font-semibold"
            />
            {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
          </div>
          <Header6 text="Total Payment Made" />
        </div>
        <div className="flex gap-16">
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.contracts)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header6 text="Total Revised Contracts" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.contractPayments)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header6 text="Total Within Contract" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.noncontractPayments)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header6 text="Total Outside Contract" />
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
          value={projectId}
          placeholder="Select a project"
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
          value={contractorId}
          placeholder="Select a contractor"
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
          valueChange={setCurrencyCode}
          value={currencyCode}
          placeholder="Select a currency"
          label="Currencies"
        >
          {currency_list.map((item) => {
            return (
              <SelectItem
                className="cursor-pointer"
                key={item?.name}
                value={item?.code}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectBar>
        <CheckedButton
          clickedFn={totalAmount}
          disabledLogic={
            !contractorId.length || !projectId.length || !currencyCode.length
          }
        />
        <Reset clickedFn={reset} />
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
