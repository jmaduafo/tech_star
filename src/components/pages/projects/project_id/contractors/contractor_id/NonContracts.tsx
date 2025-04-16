"use client";
import React, { useActionState, useEffect, useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddButton from "@/components/ui/buttons/AddButton";
import { Payment, User, Amount, Stage } from "@/types/types";
import Input from "@/components/ui/input/Input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import { optionalS } from "@/utils/optionalS";
import DataTable from "@/components/ui/tables/DataTable";
import { paymentColumns } from "@/components/ui/tables/columns";
import Loading from "@/components/ui/Loading";
import { createPayment } from "@/zod/actions";

function NonContracts({
  user,
  data,
  contractorId,
  projectId,
  stagesData,
}: {
  readonly user: User | undefined;
  readonly data: Payment[] | undefined;
  readonly stagesData: Stage[] | undefined;
  readonly projectId: string | undefined;
  readonly contractorId: string | undefined;
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      createPayment(
        prevState,
        formData,
        { id: user?.id as string, team_id: user?.team_id as string },
        {
          project_id: projectId as string,
          contractor_id: contractorId as string,
        },
        {
          dateInput: contractDate,
          bankNames: bankInputs,
          currencies: currencyInputs,
        },
        { id: null, code: null, stage_id: null }
      ),
    {
      data: {
        desc: "",
        stage_id: "",
        comment: "",
        is_completed: false,
      },
      message: "",
      success: false,
    }
  );
  const [contractDate, setContractDate] = useState<Date>();
  const [bankInputs, setBankInputs] = useState<string[]>([]);
  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);

  const [isUnlimited, setIsUnlimited] = useState(false);
  const [open, setOpen] = useState(false);

  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");

  function handleAddCurrency() {
    if (
      (currencyCode.length && +currencyAmount > 0) ||
      (isUnlimited && currencyAmount.length < 16)
    ) {
      const currencyIndex = currency_list.findIndex(
        (curr) => curr.code === currencyCode
      );

      setCurrencyInputs([
        {
          code: currencyCode,
          name: currency_list[currencyIndex].name,
          symbol: currency_list[currencyIndex].symbol,
          amount: isUnlimited ? "Unlimited" : +currencyAmount,
        },
      ]);

      setIsUnlimited(false);
      setCurrencyAmount("");
    }
  }

  useEffect(() => {
    if (!state?.success && state?.message.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title: "Contractor was successfully updated!",
      });

      setOpen(false);
    }
  }, [state]);

  return (
    <section>
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-5">
          <Header3 text="Non-Contracts" />
          {data ? (
            <p className="text-[13.5px]">
              {data.length} result{optionalS(data.length)}
            </p>
          ) : null}
        </div>
        <div>
          {user?.is_owner || user?.role === "admin" ? (
            <AddButton
              title="non-contract"
              desc="Create a stand-alone payment"
              setOpen={setOpen}
              open={open}
            >
              <form action={action}>
                {/* DATE PICKER POPUP */}
                <Popover>
                  <p className="text-[14.5px] text-darkText mb-[5px]">
                    Payment date *
                  </p>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "text-dark90 w-full justify-start text-left font-normal"
                      }
                    >
                      <CalendarIcon />
                      {contractDate ? (
                        format(contractDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                    <Calendar
                      mode="single"
                      selected={contractDate}
                      onSelect={setContractDate}
                      initialFocus
                    />
                  </PopoverContent>
                  {/* DESCRIPTION INPUT */}
                  <Input htmlFor="desc" label="Description *" className="my-3">
                    <textarea
                      className="form"
                      id="desc"
                      name="desc"
                      defaultValue={state?.data?.desc}
                    ></textarea>
                  </Input>
                  {/* ADD AND DELETE BANK NAMES */}
                  <ArrayInput
                    label="Bank name *"
                    htmlFor="banks"
                    setInputs={setBankInputs}
                    inputs={bankInputs}
                    disabledLogic={bankInputs.length >= 1}
                  />
                  {stagesData ? (
                    <SelectBar
                      name="stage_id"
                      defaultValue={state?.data?.stage_id}
                      placeholder="Select the project stage *"
                      label="Stages"
                      className="w-full sm:w-full mb-3"
                    >
                      {stagesData.map((item) => {
                        return (
                          <SelectItem key={item.name} value={item.id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                    </SelectBar>
                  ) : null}
                  <Separator />
                  <ObjectArray handleAdd={handleAddCurrency}>
                    <div className="mb-2">
                      {currencyInputs.map((item) => {
                        return (
                          <div
                            key={item.name}
                            className="flex justify-between items-center text-[14px] mb-1"
                          >
                            <p>{item.code}</p>
                            <div className="flex items-center gap-1">
                              <p className="capitalize">
                                {item.amount !== "Unlimited"
                                  ? formatCurrency(+item.amount, item.code)
                                  : `${item.symbol} Unlimited`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <SelectBar
                      valueChange={setCurrencyCode}
                      value={currencyCode}
                      placeholder="Select a currency"
                      label="Currency"
                      className="w-full"
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
                      label="Payment amount"
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
                    <div className="flex items-center gap-2 mt-3">
                      <Switch
                        id="is_unlimited"
                        name="is_unlimited"
                        checked={isUnlimited}
                        onCheckedChange={setIsUnlimited}
                      />
                      <label htmlFor="is_unlimited">Unlimited amount?</label>
                    </div>
                  </ObjectArray>
                  <Separator />
                  {/* CHECK IF CONTRACT IS COMPLETE OR NOT */}
                  <div className="flex items-center gap-2 mt-3">
                    <Switch
                      id="is_completed"
                      name="is_completed"
                      defaultChecked={state?.data?.is_completed}
                    />
                    <label htmlFor="is_completed">
                      Is this payment complete? *
                    </label>
                  </div>
                  {/* OPTIONAL COMMENT INPUT */}
                  <Input
                    htmlFor="comment"
                    label="Optional comment"
                    className="mt-3"
                  >
                    <textarea
                      className="form"
                      id="comment"
                      name="comment"
                      defaultValue={state?.data?.comment}
                    ></textarea>
                  </Input>
                  <div className="flex justify-center mt-6 scale-75">
                    <Submit loading={isLoading} />
                  </div>
                </Popover>
              </form>
            </AddButton>
          ) : null}
        </div>
      </div>
      <div className="mt-4">
        {/* DISPLAY OF DATA TABLE WITH RENDERED DATA FROM BACKEND */}
        {!data ? (
          <div className="py-8 flex justify-center">
            <Loading className="w-10 h-10" />
          </div>
        ) : (
          <DataTable
            columns={paymentColumns}
            data={data}
            is_payment
            // DISPLAYS EXPORT BUTTON IF TRUE
            is_export
            advanced
            team_name={user ? user?.first_name : "My"}
          />
        )}
      </div>
    </section>
  );
}

export default NonContracts;
