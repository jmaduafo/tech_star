import Card from "@/components/ui/cards/MyCard";
import { User } from "@/types/types";
import React from "react";

function PaymentChart({ user }: { readonly user: User | undefined }) {
  // TOTAL PAYMENT VS MONTH (LINE CHART)
  return (
    <Card className="h-full">
      <div></div>
    </Card>
  );
}

export default PaymentChart;
