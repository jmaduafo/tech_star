import React from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";
import AuthContainer from "../AuthContainer";

function MainPage() {
  return (
    <main className="">
      <AuthContainer>
        <DashboardGrid />
        <div className="mt-4">
          <PaymentDisplay />
        </div>
      </AuthContainer>
    </main>
  );
}

export default MainPage;
