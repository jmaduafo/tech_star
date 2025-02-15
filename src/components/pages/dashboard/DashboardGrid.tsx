"use client"
import React from "react";
import Card from "@/components/ui/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import LineChartDisplay from "./LineChartDisplay";
import { useAuth } from "@/context/AuthContext";

function DashboardGrid() {
  const { userData, loading } = useAuth()

  return (
    <div className="dashGrid h-[80vh] gap-6">
      {/* Greeting */}
      <Card className="greeting">
        <Greeting user={userData}/>
      </Card>
      {/* Amount Display */}
      <div className="calc backdrop-blur-0">
        <AmountDisplay user={userData}/>
      </div>
      {/* Line chart */}
      <Card className="line">
        <LineChartDisplay user={userData} />
      </Card>
      {/* Pie chart */}
      <Card className="pie">
        <PieChartDisplay user={userData} />
        {/* <div></div> */}
      </Card>
      {/* Contractors */}
      <Card className="contractors">
        <ContractorCount user={userData}/>
      </Card>
      {/* Project */}
      <Card className="project">
        <ProjectCount user={userData} />
      </Card>
    </div>
  );
}

export default DashboardGrid;
