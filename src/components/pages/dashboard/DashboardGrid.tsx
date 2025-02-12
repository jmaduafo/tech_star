import React from "react";
import Card from "@/components/ui/MyCard";
import Header3 from "@/components/fontsize/Header3";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";

function DashboardGrid() {
  return (
      <div className="dashGrid h-[80vh] gap-6">
        {/* Greeting */}
        <Card className="greeting">
          <Greeting/>
        </Card>
        {/* Amount Display */}
        <div className="calc backdrop-blur-0">
            <AmountDisplay/>
        </div>
        {/* Line chart */}
        <Card className="line">
          <div>
            <Header3 text="At a Glance"/>
          </div>
        </Card>
        {/* Pie chart */}
        <Card className="pie">
          <div></div>
        </Card>
        {/* Contractors */}
        <Card className="contractors">
          <ContractorCount/>
        </Card>
        {/* Project */}
        <Card className="project">
          <ProjectCount/>
        </Card>
      </div>
  );
}

export default DashboardGrid;
