"use client";
import React, { useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddButton from "@/components/ui/buttons/AddButton";
import { Contract, User, Amount } from "@/types/types";
import Input from "@/components/ui/input/Input";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import ArrayInput from "@/components/ui/input/ArrayInput";
import { Switch } from "@/components/ui/switch";
import { currency_list } from "@/utils/dataTools";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import Separator from "@/components/ui/Separator";
import { formatCurrency } from "@/utils/currencies";

function Contracts({
  user,
  data,
  contractorName,
  projectName,
}: {
  readonly user: User | undefined;
  readonly data: Contract[] | undefined;
  readonly contractorName: string;
  readonly projectName: string;
}) {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  const [date, setDate] = useState<Date>();
  const [bankInputs, setBankInputs] = useState<string[]>([]);
  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);

  const [isComplete, setIsComplete] = useState(false);

  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");

  function handleAddCurrency() {
    if (currencyCode.length && +currencyAmount > 0) {
      const checkDuplicate = currencyInputs.find(
        (item) => item.code === currencyCode
      );

      // IF CHECK DUPLICATE IS NOT UNDEFINED, MEANING THAT THE CODE ALREADY EXISTS, THEN DO NOTHING
      if (checkDuplicate) {
        setCurrencyAmount("");
        return;
      }

      const currencyIndex = currency_list.findIndex(
        (curr) => curr.code === currencyCode
      );

      currencyInputs.push({
        code: currencyCode,
        name: currency_list[currencyIndex].name,
        symbol: currency_list[currencyIndex].symbol,
        amount: +currencyAmount,
      });

      setCurrencyAmount("");
    }
  }

  function deleteCurrency(item: string) {
    setCurrencyInputs(currencyInputs.filter((inp) => inp.code !== item));
  }

  return (
    <section>
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-5">
          <Header3 text="Contracts" />
          <p className="text-[13.5px]">7 results</p>
        </div>
        <div>
          <AddButton title="contract" desc="Create a contract and add payments">
            <form>
              {/* CONTRACT CODE INPUT */}
              <Input htmlFor="code" label="Contract code *">
                <input className="form" type="text" id="code" />
              </Input>
              {/* DESCRIPTION INPUT */}
              <Input htmlFor="desc" label="Description *" className="my-3">
                <textarea className="form" id="desc"></textarea>
              </Input>
              {/* DATE PICKER POPUP */}
              <Popover>
                <p className="text-[14.5px] text-darkText mb-[5px]">
                  Contract date *
                </p>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "text-dark90 w-full justify-start text-left font-normal"
                    }
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
                {/* ADD AND DELETE BANK NAMES */}
                <ArrayInput
                  label="Bank names *"
                  htmlFor="banks"
                  setInputs={setBankInputs}
                  inputs={bankInputs}
                  disabledLogic={bankInputs.length === 4}
                >
                  {bankInputs.length === 4 ? (
                    <p className="text-[14px] text-red-700">
                      You have reached the max
                    </p>
                  ) : null}
                </ArrayInput>
                <Separator />
                <ObjectArray
                  handleAdd={handleAddCurrency}
                  disabledLogic={currencyInputs.length === 4}
                >
                  <div className="mb-2">
                    {currencyInputs.map((item) => {
                      return (
                        <div
                          key={item.name}
                          className="flex justify-between items-center text-[13.5px] mb-1"
                        >
                          <p>{item.code}</p>
                          <div className="flex items-center gap-1">
                            {/* <p className="capitalize">{item.symbol}</p> */}
                            <p className="capitalize">
                              {formatCurrency(+item.amount, item.code)}
                            </p>
                            <button
                              type="button"
                              onClick={() => deleteCurrency(item.code)}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <SelectBar
                    valueChange={setCurrencyCode}
                    value="Select a currency"
                    label="Currency"
                    className="w-full sm:w-full"
                  >
                    {currency_list.map((item) => {
                      return (
                        <SelectItem key={item.name} value={item.code}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectBar>
                  <Input
                    htmlFor="amount"
                    label="Contract amount"
                    className="mt-3"
                  >
                    <input
                      className="form"
                      type="number"
                      onChange={(e) => setCurrencyAmount(e.target.value)}
                      value={currencyAmount}
                      id="amount"
                    />
                  </Input>
                  {currencyInputs.length === 4 ? (
                    <p className="text-[14px] text-red-700">
                      You have reached the max
                    </p>
                  ) : null}
                </ObjectArray>
                <Separator />
                {/* CHECK IF CONTRACT IS COMPLETE OR NOT */}
                <div className="flex items-center gap-2 mt-3">
                  <Switch
                    id="is_completed"
                    name="is_completed"
                    checked={isComplete}
                    onCheckedChange={setIsComplete}
                  />
                  <label htmlFor="is_completed">
                    Is the contract complete?
                  </label>
                </div>
                {/* OPTIONAL COMMENT INPUT */}
                <Input htmlFor="comment" label="Comment" className="mt-3">
                  <textarea className="form" id="comment"></textarea>
                </Input>
              </Popover>
            </form>
          </AddButton>
        </div>
      </div>
      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Contract no.</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[250px]">Bank name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {/* <div className="flex justify-center mt-14">
        <NotAvailable text="No contracts have been recorded yet" />
      </div> */}
    </section>
  );
}

export default Contracts;
