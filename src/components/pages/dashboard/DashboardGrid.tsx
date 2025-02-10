import React from "react";
import Card from "@/components/ui/Card";

function DashboardGrid() {
  return (
      <div className="dashGrid h-[80vh] gap-6">
        {/* Greeting */}
        <Card className="greeting">
          <div></div>
        </Card>
        {/* Amount Display */}
        <div className="calc backdrop-blur-0">
          <div className="">
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
          </div>
        </div>
        {/* Line chart */}
        <Card className="line">
          <div></div>
        </Card>
        {/* Pie chart */}
        <Card className="pie">
          <div></div>
        </Card>
        {/* Contractors */}
        <Card className="contractors">
          <div></div>
        </Card>
        {/* Project */}
        <Card className="project">
          <div></div>
        </Card>
      </div>
  );
}

export default DashboardGrid;
