"use client";
import React, { useEffect, useState } from "react";
import AuthContainer from "../AuthContainer";
import ContentContainer from "../ContentContainer";
import { useAuth } from "@/context/AuthContext";
import DataTable from "@/components/ui/tables/DataTable";
import {
  contractColumns,
  paymentColumns,
} from "@/components/ui/tables/columns";
import {
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Contract, Contractor, Payment, Project, Stage } from "@/types/types";
import Loading from "@/components/ui/Loading";
import { currency_list } from "@/utils/dataTools";
import MultipleSelectBar from "@/components/ui/input/MultipleSelectBar";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Reset from "@/components/ui/buttons/Reset";
import { getQueriedItems } from "@/firebase/actions";

function MainPage() {
  const [category, setCategory] = useState("Payments");

  const [paymentData, setPaymentData] = useState<Payment[] | undefined>();
  const [contractData, setContractData] = useState<Contract[] | undefined>();
  const [filterPaymentData, setFilterPaymentData] = useState<
    Payment[] | undefined
  >();
  const [filterContractData, setFilterContractData] = useState<
    Contract[] | undefined
  >();

  const [projectsData, setProjectsData] = useState<Project[] | undefined>();
  const [contractorData, setContractorData] = useState<
    Contractor[] | undefined
  >();
  const [stageData, setStageData] = useState<Stage[] | undefined>();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  const { userData } = useAuth();

  const toggleProjects = (item: string) => {
    setSelectedProjects((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };
  const toggleStages = (item: string) => {
    setSelectedStages((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };
  const toggleContractors = (item: string) => {
    setSelectedContractors((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getAllData = async () => {
    try {
      if (!userData) {
        return;
      }

      const [projects, contractors, stages, payments, contracts] =
        await Promise.all([
          getQueriedItems(
            query(
              collection(db, "projects"),
              where("team_id", "==", userData?.team_id)
            )
          ),
          getQueriedItems(
            query(
              collection(db, "contractors"),
              where("team_id", "==", userData?.team_id)
            )
          ),
          getQueriedItems(
            query(
              collection(db, "stages"),
              where("team_id", "==", userData?.team_id),
              orderBy("created_at", "desc")
            )
          ),
          getQueriedItems(
            query(
              collection(db, "payments"),
              where("team_id", "==", userData?.team_id),
              orderBy("created_at", "desc")
            )
          ),
          getQueriedItems(
            query(
              collection(db, "contracts"),
              where("team_id", "==", userData?.team_id),
              orderBy("created_at", "desc")
            )
          ),
        ]);

      setProjectsData(projects as Project[]);
      setContractorData(contractors as Contractor[]);
      setStageData(stages as Stage[]);

      setPaymentData(payments as Payment[]);
      setFilterPaymentData(payments as Payment[]);

      setContractData(contracts as Contract[]);
      setFilterContractData(contracts as Contract[]);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  function filterData() {
    // SET MUTATED ARRAYS STATE TO CONTAIN ALL OF THE ORIGINAL DATA SO THAT
    // IT PROPERLY FILTERS
    setFilterPaymentData(paymentData);
    setFilterContractData(contractData);

    const array = [
      { index: 0, arr: selectedProjects },
      { index: 1, arr: selectedContractors },
      { index: 2, arr: selectedStages },
      { index: 3, arr: selectedCurrency },
    ];

    const nonempty = array.filter((i) => i.arr.length);

    setFilterPaymentData((prev) =>
      prev?.filter((i) => {
        const filter = [
          i.project_name,
          i.contractor_name,
          i.stage_name,
          i.currency_name,
        ];
        nonempty.forEach((item) => {
          if (item.arr.length) {
            return item.arr.includes(filter[item.index]);
          }
        });
      })
    );

    setFilterContractData((prev) =>
      prev?.filter((i) => {
        const filter = [
          i.project_name,
          i.contractor_name,
          i.stage_name,
          i.currency_name,
        ];

        nonempty.forEach((item) => {
          if (item.arr.length) {
            return item.arr.includes(filter[item.index]);
          }
        });
      })
    );
  }

  function resetData() {
    setFilterPaymentData(paymentData);
    setFilterContractData(contractData);
    setSelectedContractors([]);
    setSelectedStages([]);
    setSelectedProjects([]);
    setSelectedCurrency("");
  }

  useEffect(() => {
    getAllData()
  }, [userData?.id ?? "guest"]);

  const table =
    category === "Payments" ? (
      <DataTable
        columns={paymentColumns}
        data={filterPaymentData ?? []}
        is_payment={true}
        team_name={userData ? userData?.first_name : "My"}
        is_export
        advanced
      />
    ) : (
      <DataTable
        columns={contractColumns}
        data={filterContractData ?? []}
        is_payment={false}
        team_name={userData ? userData?.first_name : "My"}
        is_export
        advanced
      />
    );

  return (
    <AuthContainer>
      <ContentContainer>
        <div className="flex  flex-wrap justify-between items-center gap-x-4 gap-y-6 mt-14 mb-6">
          {/* MORE SORT AND FILTER OPTIONS */}
          <div>
            <SelectBar
              value={category}
              placeholder={"Select a category"}
              label="Categories"
              valueChange={setCategory}
              className="w-[160px]"
            >
              {["Payments", "Contracts"].map((item) => {
                return (
                  <SelectItem key={item} value={item} className="capitalize">
                    {item}
                  </SelectItem>
                );
              })}
            </SelectBar>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <MultipleSelectBar value={"Select projects"}>
              {projectsData
                ? projectsData?.map((item) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={item.name}
                        checked={selectedProjects.includes(item.name)}
                        onCheckedChange={() => toggleProjects(item.name)}
                      >
                        {item.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })
                : null}
            </MultipleSelectBar>
            <MultipleSelectBar value={"Select stages"}>
              {stageData
                ? stageData?.map((item) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={item.name}
                        checked={selectedStages.includes(item.name)}
                        onCheckedChange={() => toggleStages(item.name)}
                      >
                        {item.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })
                : null}
            </MultipleSelectBar>
            <MultipleSelectBar value={"Select contractors"}>
              {contractorData
                ? contractorData?.map((item) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={item.name}
                        checked={selectedContractors.includes(item.name)}
                        onCheckedChange={() => toggleContractors(item.name)}
                      >
                        {item.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })
                : null}
            </MultipleSelectBar>
            <SelectBar
              value={selectedCurrency}
              placeholder="Select a currency"
              label="Currencies"
              valueChange={setSelectedCurrency}
            >
              {currency_list.map((item) => {
                return (
                  <SelectItem key={item.code} value={item.name}>
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectBar>
            <CheckedButton
              clickedFn={() => filterData()}
              disabledLogic={!category.length || !selectedProjects.length}
            />
            <Reset clickedFn={() => resetData()} />
          </div>
        </div>
        <div>
          {/* TABLE DISPLAY */}
          {!filterPaymentData || !filterContractData ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            table
          )}
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
