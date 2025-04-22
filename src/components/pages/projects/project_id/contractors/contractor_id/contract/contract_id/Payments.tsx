"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Amount, Contract, Payment, User } from "@/types/types";
import DataTable from "@/components/ui/tables/DataTable";
import { paymentColumns } from "@/components/ui/tables/columns";
import Loading from "@/components/ui/Loading";
import AddButton from "@/components/ui/buttons/AddButton";
import Submit from "@/components/ui/buttons/Submit";
import ArrayInput from "@/components/ui/input/ArrayInput";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currencies";
import { currency_list } from "@/utils/dataTools";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import Separator from "@/components/ui/Separator";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Input from "@/components/ui/input/Input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Header3 from "@/components/fontsize/Header3";
import { createPayment } from "@/zod/actions";

type PaymentType = {
  readonly user: User | undefined;
  readonly data: Payment[] | undefined;
  readonly contract: Contract | undefined;
  readonly projectId: string | string[];
  readonly contractorId: string | string[];
};

function Payments({
  user,
  data,
  contract,
  projectId,
  contractorId,
}: PaymentType) {
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
          dateInput: paymentDate,
          bankNames: bankInputs,
          currencies: currencyInputs,
        },
        {
          id: contract?.id as string,
          code: contract?.contract_code as string,
          stage_id: contract?.stage_id as string,
        }
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
  const [paymentDate, setPaymentDate] = useState<Date>();
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
    contract?.bank_name
      ? setBankInputs([contract?.bank_name])
      : setBankInputs([]);
  }, [contract, open]);

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
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-start gap-5">
          <Header3 text="All Payments" />
        </div>
        <div>
          {user?.is_owner ||
          (user?.role === "admin" && !contract?.is_completed) ? (
            <AddButton
              title="payment"
              desc={`Create a payment for contract ${contract?.contract_code}`}
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
                      {paymentDate ? (
                        format(paymentDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                      initialFocus
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                  {/* DESCRIPTION INPUT */}
                  <Input htmlFor="desc" label="Description" className="my-3">
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
                    hideX
                  />
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
                      placeholder="Select a currency *"
                      label="Currency"
                      className="w-full"
                    >
                      <SelectItem
                        key={contract?.currency_code}
                        value={contract?.currency_code ?? ""}
                      >
                        {contract?.currency_name}
                      </SelectItem>
                    </SelectBar>
                    <Input
                      htmlFor="amount"
                      label="Payment amount *"
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
                  {/* SUBMIT BUTTON */}
                  <div className="flex justify-end mt-6">
                    <Submit
                      loading={isLoading}
                      width_height="w-[85px] h-[40px]"
                      width="w-[40px]"
                      arrow_width_height="w-6 h-6"
                      disabledLogic={isLoading}
                    />
                  </div>
                </Popover>
              </form>
            </AddButton>
          ) : null}
        </div>
      </div>
      <div>
        {!data ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : (
          <DataTable
            columns={paymentColumns}
            data={data}
            is_payment
            is_export
            team_name={user?.first_name ?? "My "}
          />
        )}
      </div>
    </section>
  );
}

export default Payments;
