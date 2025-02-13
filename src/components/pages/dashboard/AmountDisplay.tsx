"use client";
import React, { useState, useEffect } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header5 from "@/components/fontsize/Header5";
import Header2 from "@/components/fontsize/Header2";
import Header4 from "@/components/fontsize/Header4";
import { getAllItems } from "@/firebase/actions";
import { HiCheckCircle } from "react-icons/hi2";
import { Contractor, Project } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";

function AmountDisplay() {
  const [projectName, setProjectName] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [currencyTitle, setCurrencyTitle] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [allProjects, setAllProjects] = useState<Project[]>();
  const [allContractors, setAllContractors] = useState<Contractor[]>();
  const [submit, setSubmit] = useState({
    project: "",
    contractor: "",
    currency: "",
  });

  function totalAmount() {
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
  }

  async function allData() {
    const projects = await getAllItems("projects")
    const contractors = await getAllItems("contractors")

    contractors?.length && setAllContractors(contractors as Contractor[])
    projects?.length && setAllProjects(projects as Project[])
  }

  useEffect(() => {
    allData()
  }, [])

  return (
    <div className="">
      <div className="flex gap-4">
        <SelectBar
          valueChange={setProjectName}
          value="Select a project"
          label="Projects"
        >
          {allProjects?.length ? allProjects.map((item) => {
            return (
              <SelectItem key={item?.id} value={item?.name}>
                {item?.name}
              </SelectItem>
            );
          })
          :
          null
        }
        </SelectBar>
        <SelectBar
          valueChange={setContractorName}
          value="Select a contractor"
          label="Contractors"
        >
          {allContractors?.length ? allContractors.map((item) => {
            return (
              <SelectItem key={item?.id} value={item?.name}>
                {item?.name}
              </SelectItem>
            );
          })
          :
          null
        }
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
          disabled={
            !contractorName.length ||
            !projectName.length ||
            !currencyTitle.length
          }
        >
          <HiCheckCircle className="text-darkText w-7 h-7" />
        </button>
      </div>
      {
        allProjects?.length && allContractors?.length ?

      <div className="mt-6 flex justify-between items-end">
        <div>
          <div className="flex items-start gap-3">
            <Header1 text="9.32b" className="font-semibold" />
            {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
          </div>
          <Header5 text="Total Payment Made" />
        </div>
        <div className="flex gap-16">
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="10.27b" className="font-medium" />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Revised Contracts" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="8.56b" className="font-medium" />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Within Contract" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="445.37m" className="font-medium" />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <Header5 text="Total Outside Contract" />
          </div>
        </div>
      </div>
        :
        <div className="py-6 flex justify-center items-center">
          <NotAvailable text="No payments available"/>
          <p></p>
        </div>
      }
    </div>
  );
}

export default AmountDisplay;
