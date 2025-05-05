import React, { useEffect, useState } from "react";
import ContractorChart from "./ContractorChart";
import PaymentChart from "./PaymentChart";
import StageChart from "./StageChart";
import {
  Contract,
  Contractor,
  Payment,
  Project,
  Stage,
  User,
} from "@/types/types";
import { getQueriedItems } from "@/firebase/actions";
import { db } from "@/firebase/config";
import { query, collection, where, orderBy, limit } from "firebase/firestore";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";

function ChartDisplay({ user }: { readonly user: User | undefined }) {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [allStages, setAllStages] = useState<Stage[] | undefined>();
  const [allContractors, setAllContractors] = useState<
  Contractor[] | undefined
  >();
  const [allContracts, setAllContracts] = useState<Contract[] | undefined>();
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  
  const [project, setProject] = useState("");
  const [type, setType] = useState("Payments");

  const getProjects = async () => {
    try {
      const projectq = query(
        collection(db, "projects"),
        where("team_id", "==", user?.team_id),
        orderBy("created_at", "desc")
      );

      const oneProjectq = query(
        collection(db, "projects"),
        where("team_id", "==", user?.team_id),
        orderBy("created_at", "desc"),
        limit(1)
      );

      const [projects, oneProject] = await Promise.all([
        getQueriedItems(projectq),
        getQueriedItems(oneProjectq),
      ]);

      setAllProjects(projects as Project[]);

      return {
        message: oneProject[0]?.id,
        success: true,
      };
    } catch (err: any) {
      return {
        message: err.message,
        success: false,
      };
    }
  };

  const getData = async () => {
    try {
      if (!user) {
        return;
      }

      // SHOULD RETURN THE FIRST PROJECT ID
      const response = await getProjects();

      if (!response.success) {
        console.log(response.message);
        return;
      }

      setProject(response.message);

      const contractorq = query(
        collection(db, "contractors"),
        where(
          "project_id",
          "==",
          !project.length ? response?.message : project
        ),
        where("team_id", "==", user?.team_id)
      );

      const contractq = query(
        collection(db, "contracts"),
        where(
          "project_id",
          "==",
          !project.length ? response?.message : project
        ),
        where("team_id", "==", user?.team_id)
      );

      const stagesq = query(
        collection(db, "stages"),
        where(
          "project_id",
          "==",
          !project.length ? response?.message : project
        ),
        where("team_id", "==", user?.team_id)
      );

      const paymentq = query(
        collection(db, "payments"),
        where(
          "project_id",
          "==",
          !project.length ? response?.message : project
        ),
        where("team_id", "==", user?.team_id)
      );

      const [contractors, contracts, stages, payments] = await Promise.all([
        getQueriedItems(contractorq),
        getQueriedItems(contractq),
        getQueriedItems(stagesq),
        getQueriedItems(paymentq),
      ]);

      setAllContractors(contractors as Contractor[]);
      setAllContracts(contracts as Contract[]);
      setAllStages(stages as Stage[]);
      setAllPayments(payments as Payment[]);

      // GET HOW MUCH SPENT FOR EACH CONTRACT
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, [user?.id ?? "guest", project ?? "trim"]);

  return (
    <section className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <SelectBar
          placeholder={"Select a project"}
          label={"Projects"}
          value={project}
          valueChange={setProject}
        >
          {allProjects
            ? allProjects.map((item) => {
                return (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          placeholder={"Select a type"}
          label={"Type"}
          value={type}
          valueChange={setType}
        >
          {["Payments", "Contracts"].map((item) => {
                return (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                );
              })
            }
        </SelectBar>
      </div>
      <div className="summaryGrid h-[60vh] gap-4">
        <div className="contractor">
          <ContractorChart
            payments={allPayments}
            contractors={allContractors}
          />
        </div>
        <div className="payment">
          <PaymentChart payments={allPayments} />
        </div>
        <div className="stage">
          <StageChart contracts={allContracts} stages={allStages} />
        </div>
      </div>
    </section>
  );
}

export default ChartDisplay;
