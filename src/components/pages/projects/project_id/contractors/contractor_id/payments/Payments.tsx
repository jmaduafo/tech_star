"use client";
import React, { useState } from "react";
import { Amount, Payment, Stage, User } from "@/types/types";
import DataTable from "@/components/ui/tables/DataTable";
import { paymentColumns } from "@/components/ui/tables/columns";
import Loading from "@/components/ui/Loading";
import AddButton from "@/components/ui/buttons/AddButton";
import Submit from "@/components/ui/buttons/Submit";
import ArrayInput from "@/components/ui/input/ArrayInput";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import { addItem } from "@/firebase/actions";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currencies";
import { currency_list } from "@/utils/dataTools";
import { CreatePaymentSchema } from "@/zod/validation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import Separator from "@/components/ui/Separator";
import { Switch } from "@/components/ui/switch";
import { serverTimestamp } from "firebase/firestore";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Input from "@/components/ui/input/Input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Header3 from "@/components/fontsize/Header3";

type PaymentType = {
  readonly user: User | undefined;
  readonly data: Payment[] | undefined;
  readonly stagesData: Stage[] | undefined;
  readonly contractorName: string | undefined;
  readonly contractCode: string | undefined;
  readonly projectName: string | undefined;
  readonly projectId: string | string[];
  readonly contractorId: string | string[];
  readonly contractId: string | string[];
};

function Payments({
  user,
  data,
  projectName,
  contractorName,
  contractCode,
  projectId,
  contractorId,
  contractId,
  stagesData,
}: PaymentType) {
  const [contractDate, setContractDate] = useState<Date>();
  const [bankInputs, setBankInputs] = useState<string[]>([]);
  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);

  const [isComplete, setIsComplete] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [open, setOpen] = useState(false);

  const [stageId, setStageId] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

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

  async function handleSubmit(formData: FormData) {
    const contractDesc = formData.get("desc");
    const contractComment = formData.get("comment");

    const values = {
      desc: contractDesc,
      date: contractDate,
      bank_names: bankInputs,
      stage_id: stageId,
      currency: currencyInputs,
      comment: contractComment,
    };

    const result = CreatePaymentSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      return;
    }

    const { desc, date, stage_id, bank_names, currency, comment } = result.data;

    try {
      setLoading(true);
      if (!user || !projectId || !contractorId || !contractId || !stagesData) {
        console.log(
          "Could not find user or project id or contractor id or stages data"
        );
        return;
      }

      const stageIndex = stagesData?.findIndex((item) => item.id === stage_id);

      await addItem("payments", {
        date,
        project_id: projectId,
        contractor_id: contractorId,
        contract_id: contractId,
        team_id: user.team_id,
        stage_id: stage_id,
        project_name: projectName,
        contractor_name: contractorName,
        stage_name: stageIndex ? stagesData[stageIndex]?.name : null,
        contract_code: contractCode,
        bank_name: bank_names[0],
        currency_amount: currency[0].amount,
        currency_symbol: currency[0].symbol,
        currency_code: currency[0].code,
        currency_name: currency[0].name,
        is_completed: isComplete,
        description: desc.trim(),
        comment: comment ? comment.trim() : null,
        is_contract: true,
        created_at: serverTimestamp(),
        updated_at: null,
      });

      toast({
        title: "Payment added successfully!",
      });

      setBankInputs([]);
      setCurrencyInputs([]);
      setIsComplete(false);

      setOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-start gap-5">
          <Header3 text="Payments" />
        </div>
        <div>
          {user?.is_admin ? (
            <AddButton
              title="payment"
              desc={`Create a payment for contract ${contractCode}`}
              setOpen={setOpen}
              open={open}
            >
              <form action={handleSubmit}>
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
                    <textarea className="form" id="desc" name="desc"></textarea>
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
                      valueChange={setStageId}
                      value={stageId}
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
                      checked={isComplete}
                      onCheckedChange={setIsComplete}
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
                    ></textarea>
                  </Input>
                  <div className="flex justify-center mt-6 scale-75">
                    <Submit loading={loading} />
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
            team_name={""}
          />
        )}
      </div>
    </section>
  );
}

export default Payments;
