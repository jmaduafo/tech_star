import React from "react";
import Card from "@/components/ui/MyCard";
import Header3 from "@/components/fontsize/Header3";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Banner from "@/components/ui/Banner";

function PaymentDisplay() {
  const invoices = [
    {
      contractor: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      projectName: "Credit Card",
      date: "Jan. 4, 2025",
    },
    {
      contractor: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      projectName: "PayPal",
      date: "Dec. 25, 2024",
    },
    {
      contractor: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      projectName: "Bank Transfer",
      date: "Nov. 17, 2024",
    },
    {
      contractor: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      projectName: "Credit Card",
      date: "Nov. 1, 2024",
    },
    {
      contractor: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      projectName: "PayPal",
      date: "Oct. 19, 2024",
    },
  ];

  return (
    <Card className="w-full">
      <div className="flex items-start gap-3">
        <Header3 text="Latest Payments" />
        <p>Max. 5</p>
      </div>
      <div className="mt-6">
        <Table>
          <TableCaption></TableCaption>
          <TableHeader className="hover:bg-transparent">
            <TableRow>
              <TableHead className="w-[150px]">Contractor</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.contractor}>
                <TableCell className="font-medium">
                  {invoice.contractor}
                </TableCell>
                <TableCell>{invoice.projectName}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <Banner text={invoice.paymentStatus} />
                </TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {/* <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow> */}
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
}

export default PaymentDisplay;
