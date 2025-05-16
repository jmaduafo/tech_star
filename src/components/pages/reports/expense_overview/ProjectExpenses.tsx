import { Contract, Payment, ProjectReport, User } from "@/types/types";
import React, { Fragment, useEffect, useState } from "react";
import DataTable from "@/components/ui/tables/DataTable";
import { projectReportColumns } from "@/components/ui/tables/columns";
import { db } from "@/firebase/config";
import { query, collection, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getQueriedItems } from "@/firebase/actions";
import { totalSum } from "@/utils/currencies";
import Loading from "@/components/ui/Loading";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { currency_list } from "@/utils/dataTools";

function ProjectExpenses({ user }: { readonly user: User | undefined }) {
  const [fullReport, setFullReport] = useState<ProjectReport[] | undefined>();
  const [ currency, setCurrency ] = useState("")

  // Total this month
  // Project Name, number of payments, total fixed contract sum, Total expenses (total within + total outside),
  // % of expenses (total within / total fixed)
  const { userData } = useAuth();

  const report = async () => {
    if (!userData) {
      return;
    }

    const projectq = query(
      collection(db, "projects"),
      where("team_id", "==", userData?.team_id)
    );
    const contractq = query(
      collection(db, "contracts"),
      where("team_id", "==", userData?.team_id)
    );
    const paymentq = query(
      collection(db, "payments"),
      where("team_id", "==", userData?.team_id)
    );

    const [projects, contracts, payments] = await Promise.all([
      getQueriedItems(projectq),
      getQueriedItems(contractq),
      getQueriedItems(paymentq),
    ]);

    const projectIds = projects.map((item) => item.id);
    const projectName = projects.map((item) => item.name);

    const totalPayments: number[] = [];

    projectIds.forEach((item) => {
      totalPayments.push(
        payments.filter((fil) => fil.project_id === item).length
      );
    });

    const totalContracts: number[] = [];

    projectIds.forEach((item) => {
      totalContracts.push(
        contracts.filter((fil) => fil.project_id === item).length
      );
    });

    const totalContractSum: any[] = [];

    projectIds.forEach((item) => {
      const contractFilters = contracts.filter(
        (fil) => fil.project_id === item
      );

      totalContractSum.push(contractFilters as unknown as Contract[]);
    });

    const totalExpenses: any[] = [];

    projectIds.forEach((item) => {
      const paymentFilters = payments.filter((fil) => fil.project_id === item);

      totalExpenses.push(paymentFilters as unknown as Payment[]);
    });

    const projectReport: ProjectReport[] = [];

    projectName.forEach((item, i) => {
      projectReport.push({
        name: item,
        total_payments: totalPayments[i],
        total_contracts: totalContracts[i],
        contracts: totalContractSum[i],
        expenses: totalExpenses[i],
      });
    });

    setFullReport(projectReport);
  };

  const filterReport = async () => {
    let contract = []

    fullReport?.forEach(item => {
      const filter = item.contracts.filter(con => con.currency_code === currency)

      contract = filter
    })

    let expense = []

    fullReport?.forEach(item => {
      const filter = item.expenses.filter(con => con.currency_code === currency)

      expense = filter
    })

    
    
  };



  useEffect(() => {
    report();
  }, [userData?.id ?? "guest"]);


  return (
    <div>
      <div className="mb-3">
        <SelectBar placeholder={"Select a currency"} label={"Currencies"}>
          {currency_list.map((item) => {
            return (
              <Fragment key={item.code}>
                <SelectItem value={item.code}>{item.name}</SelectItem>
              </Fragment>
            );
          })}
        </SelectBar>
      </div>
      {!fullReport ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <DataTable
          columns={projectReportColumns}
          data={fullReport}
          is_payment={false}
          team_name={""}
          filterCategory="name"
        />
      )}
    </div>
  );
}

export default ProjectExpenses;
