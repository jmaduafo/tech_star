"use client";
import React, { useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddButton from "@/components/ui/buttons/AddButton";
import { Contract, User, Amount, Stage } from "@/types/types";
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
import Submit from "@/components/ui/buttons/Submit";
import { CreateContractSchema } from "@/zod/validation";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/firebase/actions";
import { serverTimestamp } from "firebase/firestore";
import { optionalS } from "@/utils/optionalS";
import DataTable from "@/components/ui/tables/DataTable";
import { contractColumns } from "@/components/ui/tables/columns";
import Loading from "@/components/ui/Loading";

function Contracts({
  user,
  data,
  contractorName,
  projectName,
  contractorId,
  projectId,
  stagesData,
}: {
  readonly user: User | undefined;
  readonly data: Contract[] | undefined;
  readonly stagesData: Stage[] | undefined;
  readonly contractorName: string;
  readonly projectName: string;
  readonly projectId: string | undefined;
  readonly contractorId: string | undefined;
}) {
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
      const checkDuplicate = currencyInputs.find(
        (item) => item.code === currencyCode
      );

      // IF CHECK DUPLICATE IS NOT UNDEFINED, MEANING THAT THE CURRENCY CODE ALREADY EXISTS,
      // THEN CLEAR THE INPUT FIELD AND DO NOTHING
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
        amount: isUnlimited ? "Unlimited" : +currencyAmount,
      });

      setIsUnlimited(false);
      setCurrencyAmount("");
    }
  }

  function deleteCurrency(item: string) {
    setCurrencyInputs(currencyInputs.filter((inp) => inp.code !== item));
  }

  async function handleSubmit(formData: FormData) {
    const contractCode = formData.get("code");
    const contractDesc = formData.get("desc");
    const contractComment = formData.get("comment");

    const values = {
      code: contractCode,
      desc: contractDesc,
      date: contractDate,
      bank_names: bankInputs,
      stage_id: stageId,
      currency: currencyInputs,
      comment: contractComment,
    };

    const result = CreateContractSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      return;
    }

    const { code, desc, date, stage_id, bank_names, currency, comment } =
      result.data;

    if (!user || !projectId || !contractorId || !stagesData) {
      return;
    }

    try {
      setLoading(true);

      await addItem("contracts", {
        date,
        project_id: projectId,
        contractor_id: contractorId,
        team_id: user.team_id,
        stage_id: stage_id,
        contract_code: code,
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
        title: "Contract added successfully!",
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
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-5">
          <Header3 text="Contracts" />
          {data ? (
            <p className="text-[13.5px]">
              {data.length} result{optionalS(data.length)}
            </p>
          ) : null}
        </div>
        <div>
          {user?.is_owner || user?.role === "admin" ? (
            <AddButton
              title="contract"
              desc="Create a contract and add payments"
              setOpen={setOpen}
              open={open}
            >
              <form action={handleSubmit}>
                {/* CONTRACT CODE INPUT */}
                <Input htmlFor="code" label="Contract code *">
                  <input className="form" type="text" id="code" name="code" />
                </Input>
                {/* DESCRIPTION INPUT */}
                <Input htmlFor="desc" label="Description *" className="my-3">
                  <textarea className="form" id="desc" name="desc"></textarea>
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
                  <SelectBar
                    valueChange={setStageId}
                    value={stageId}
                    placeholder="Select the project stage *"
                    label="Stages"
                    className="w-full sm:w-full mb-3"
                  >
                    {stagesData
                      ? stagesData.map((item) => {
                          return (
                            <SelectItem key={item.name} value={item.id}>
                              {item.name}
                            </SelectItem>
                          );
                        })
                      : null}
                  </SelectBar>
                  <Separator />
                  <ObjectArray
                    handleAdd={handleAddCurrency}
                    disabledLogic={currencyInputs.length >= 1}
                  >
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
                      value={currencyCode}
                      placeholder="Select a currency"
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
                      Is the contract complete? *
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
      <div className="mt-4">
        {/* DISPLAY OF DATA TABLE WITH RENDERED DATA FROM BACKEND */}
        {!data ? (
          <div className="py-8 flex justify-center">
            <Loading className="w-10 h-10" />
          </div>
        ) : (
          <DataTable
            columns={contractColumns}
            data={data}
            is_payment={false}
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

export default Contracts;
