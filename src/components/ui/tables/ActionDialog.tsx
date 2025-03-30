"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Amount, Contract, Payment, Stage } from "@/types/types";
import { MoreHorizontal, CalendarIcon } from "lucide-react";
import ArrayInput from "@/components/ui/input/ArrayInput";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateAndTime";
import Banner from "../Banner";
import { formatCurrency } from "@/utils/currencies";
import { format as formatAgo } from "timeago.js";
import { format } from "date-fns";
import {
  deleteContractAndPayments,
  deleteItem,
  getQueriedItems,
  updateItem,
} from "@/firebase/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Loading from "../Loading";
import { currency_list } from "@/utils/dataTools";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import Input from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/Separator";
import { Switch } from "@/components/ui/switch";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import Header3 from "@/components/fontsize/Header3";
import Submit from "../buttons/Submit";
import { db } from "@/firebase/config";
import { CreateContractSchema, CreatePaymentSchema } from "@/zod/validation";

type Dialog = {
  readonly data: Contract | Payment | undefined;
  readonly is_payment?: boolean;
};

function ActionDialog({ data, is_payment }: Dialog) {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [stagesData, setStagesData] = useState<Stage[] | undefined>();

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [contractDate, setContractDate] = useState<Date>();
  const [bankInputs, setBankInputs] = useState<string[]>([]);
  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);

  const [isComplete, setIsComplete] = useState(true);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");

  const [userComment, setUserComment] = useState("");
  const [description, setDescription] = useState("");
  const [contractCode, setContractCode] = useState("");
  const [stageId, setStageId] = useState("");

  const [contractorName, setContractorName] = useState<string | undefined>();
  const [projectName, setProjectName] = useState<string | undefined>();
  const [stageName, setStageName] = useState<string | undefined>();

  async function loadEditEntries() {
    try {
      if (!data || !userData) {
        return;
      }

      const stagesq = query(
        collection(db, "stages"),
        where("project_id", "==", data.project_id),
        where("team_id", "==", userData?.team_id),
        orderBy("created_at")
      );

      const stages = await getQueriedItems(stagesq);

      setStagesData(stages as Stage[]);

      setStageId(data?.stage_id);
      setContractCode(data.contract_code ?? "");
      setContractDate(new Date(data?.date?.seconds * 1000));
      setBankInputs([data.bank_name]);
      setCurrencyInputs([
        ...currencyInputs,
        {
          code: data?.currency_code,
          amount: data?.currency_amount,
          name: data?.currency_name,
          symbol: data?.currency_symbol,
        },
      ]);
      setIsComplete(data.is_completed);
      setIsUnlimited(data.currency_amount === "Unlimited");
      setCurrencyCode(data?.currency_code);
      setCurrencyAmount(
        data?.currency_amount !== "Unlimited"
          ? data.currency_amount.toString()
          : ""
      );
      setDescription(data.description);
      setUserComment(data.comment ?? "");
    } catch (err: any) {
      console.log(err.message);
    }
  }

  // FOR EDIT DIALOG, SETS THE CURRENCY AMOUNT AND CODE
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

  //   HANDLES DELETION OF CONTRACT OR PAYMENT FROM DATABASE
  async function handleDeletePayment(payment_id: string) {
    try {
      setLoadingDelete(true);

      await deleteItem("payments", payment_id);

      toast({
        title: "Payment was deleted successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoadingDelete(false);
    }
  }

  //   HANDLES DELETION OF CONTRACT OR PAYMENT FROM DATABASE
  async function handleDeleteContract(contract_id: string, project_id: string) {
    try {
      setLoadingDelete(true);

      const response = await deleteContractAndPayments(contract_id, project_id);

      if (response !== "success") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: response,
        });

        return;
      }

      toast({
        title: "Contract was deleted successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoadingDelete(false);
    }
  }

  //   HANDLES DELETION OF CONTRACT OR PAYMENT FROM DATABASE
  async function handleEditPayment(id: string) {
    const values = {
      desc: description,
      date: contractDate,
      bank_names: bankInputs,
      currency: currencyInputs,
      comment: userComment,
    };

    const result = CreatePaymentSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result?.error?.issues[0].message,
      });

      return;
    }

    const { date, desc, currency, bank_names, comment } = result.data;

    try {
      setLoadingEdit(true);

      await updateItem("contracts", id, {
        date,
        description: desc,
        currency_amount: currency[0].amount,
        currency_symbol: currency[0].symbol,
        currency_name: currency[0].name,
        currency_code: currency[0].code,
        bank_name: bank_names[0],
        comment: comment ?? null,
        is_completed: isComplete,
        updated_at: serverTimestamp(),
      });

      toast({
        title: "Payment was edited successfully!",
      });

      setEditDialogOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  //   HANDLES UPDATE OF CONTRACT AND SUBSEQUENTLY UPDATES PAYMENTS UNDER THE UPDATED CONTRACT
  async function handleEditContract(id: string) {
    const values = {
      code: contractCode,
      desc: description,
      date: contractDate,
      bank_names: bankInputs,
      stage_id: stageId,
      currency: currencyInputs,
      comment: userComment,
    };

    const result = CreateContractSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result?.error?.issues[0].message,
      });

      return;
    }

    const { code, date, desc, stage_id, currency, bank_names, comment } =
      result.data;

    try {
      setLoadingEdit(true);

      const batch = writeBatch(db);

      // Retrieve all payments linked to this contract
      const paymentsQ = query(
        collection(db, "payments"),
        where("contract_id", "==", id)
      );
      const paymentsSnap = await getDocs(paymentsQ);

      // Update contract as part of batch
      batch.update(doc(db, "contracts", id), {
        contract_code: code,
        date,
        description: desc,
        stage_id,
        currency_amount: currency[0].amount,
        currency_symbol: currency[0].symbol,
        currency_name: currency[0].name,
        currency_code: currency[0].code,
        bank_name: bank_names[0],
        comment: comment ?? null,
        is_completed: isComplete,
        updated_at: serverTimestamp(),
      });

      // Update payments if any exist
      if (!paymentsSnap.empty) {
        paymentsSnap.forEach((paymentDoc) => {
          batch.update(doc(db, "payments", paymentDoc.id), {
            currency_symbol: currency[0].symbol,
            currency_name: currency[0].name,
            currency_code: currency[0].code,
            bank_name: bank_names[0],
            stage_id,
            description: desc,
          });
        });
      }

      await batch.commit();

      toast({
        title: "Contract was edited successfully!",
      });

      setEditDialogOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // RETRIEVE ALL THE NAMES PERTAINING TO PROJECT, CONTRACTOR, STAGES, AND CONTRACT
  async function getNames() {
    try {
      if (!data) {
        return;
      }

      const [project, contractor, stage] = await Promise.all([
        getDoc(doc(db, "projects", data?.project_id)),
        getDoc(doc(db, "contractors", data?.contractor_id)),
        getDoc(doc(db, "stages", data?.stage_id)),
      ]);

      setProjectName(project?.data()?.name);
      setContractorName(contractor?.data()?.name);
      setStageName(stage?.data()?.name);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadEditEntries();
    getNames();
  }, []);

  const ongoing =
    !data?.is_completed && data?.is_contract ? "ongoing" : "pending";

  const paid = data?.is_completed && !data?.is_contract ? "paid" : ongoing;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setViewDialogOpen(true);
              setEditDialogOpen(false);
              setDeleteDialogOpen(false);
            }}
          >
            View details
          </DropdownMenuItem>
          {!is_payment ? (
            <Link
              href={`/projects/${data?.project_id}/contractors/${data?.contractor_id}/contract/${data?.id}`}
            >
              <DropdownMenuItem>View payments</DropdownMenuItem>
            </Link>
          ) : null}
          {userData?.is_admin ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setViewDialogOpen(false);
                  setDeleteDialogOpen(false);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setEditDialogOpen(false);
                  setViewDialogOpen(false);
                }}
              >
                Delete
              </DropdownMenuItem>{" "}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* VIEW DETAILS DROPDOWN DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data?.is_contract ? "Contract" : "Payment"} overview
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            {/* CONTRACTOR NAME & PROJECT NAME */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail title="contractor" item={contractorName} />
              </div>
              <div className="flex-1">
                <Detail title="project name" item={projectName} />
              </div>
            </div>
            {/* CONTRACT CODE & BANK NAMES  */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.contract_code ? (
                  <Detail title="contract code" item={data?.contract_code} />
                ) : (
                  <Detail title="contract code" item="N/A" />
                )}
              </div>
              <div className="flex-1">
                {data?.date ? (
                  <Detail
                    title={`${data?.is_contract ? "Contract" : "Payment"} date`}
                    item={formatDate(data?.date)}
                  />
                ) : null}
              </div>
            </div>
            {/* BANK NAMES AND CONTRACT DESCRIPTION */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail
                  title="Bank"
                  item={data?.bank_name}
                  className="capitalize"
                />
              </div>
              <div className="flex-1">
                <Detail title="description" item={data?.description} />
              </div>
            </div>
            {/* STAGE NAME & CONTRACT AMOUNTS */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.stage_id ? (
                  <Detail title="Stage" item={stageName} />
                ) : null}
              </div>
              <div className="flex-1">
                {data?.currency_amount && data?.currency_code ? (
                  <Detail
                    title="Amount"
                    item={
                      data?.currency_amount !== "Unlimited" &&
                      data?.currency_code
                        ? data?.currency_code +
                          " " +
                          formatCurrency(
                            +data?.currency_amount,
                            data?.currency_code
                          )
                        : `${data?.currency_symbol} Unlimited`
                    }
                  />
                ) : null}
              </div>
            </div>
            {/* CONTRACT STATUS & OPTIONAL COMMENT */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <Detail title="Status" custom>
                  <Banner
                    text={
                      data?.is_completed && data?.is_contract
                        ? "completed"
                        : paid
                    }
                  />
                </Detail>
              </div>
              <div className="flex-1">
                {data?.comment ? (
                  <Detail title="comments" item={data?.comment} />
                ) : (
                  <Detail title="comments" item="N/A" />
                )}
              </div>
            </div>
            {/* UPDATED AT */}
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                {data?.updated_at ? (
                  <Detail
                    title="Updated"
                    item={formatAgo(data?.updated_at?.seconds * 1000)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose className="text-dark90">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* EDIT PAYMENT/CONTRACT ITEMS DROPDOWN DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Edit {data?.is_contract ? "contract" : "payment"}
            </DialogTitle>
            <DialogDescription>Modify your item here.</DialogDescription>
          </DialogHeader>
          {/* Add your edit form inside DialogContent */}
          <form>
            {/* CONTRACT CODE INPUT */}
            {data?.is_contract ? (
              <Input htmlFor="code" label="Contract code *">
                <input
                  className="form"
                  type="text"
                  id="code"
                  name="code"
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                />
              </Input>
            ) : null}
            {/* DATE PICKER POPUP */}
            <Popover>
              <p
                className={`text-[14.5px] text-darkText ${
                  data?.is_contract ? "my-3" : "mt-0 mb-[5px]"
                }`}
              >
                {data?.is_contract ? "Contract" : "Payment"} date *
              </p>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`text-dark90 w-full justify-start text-left font-normal`}
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
              {/* DESCRIPTION INPUT */}
              <Input
                htmlFor="desc"
                label={`Description ${data?.is_contract ? "*" : ""}`}
                className="my-3"
              >
                <textarea
                  className="form"
                  id="desc"
                  name="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              {data?.is_contract ? (
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
                  className="w-full sm:w-full"
                >
                  {data?.is_contract ? (
                    currency_list.map((item) => {
                      return (
                        <SelectItem key={item.name} value={item.code}>
                          {item.name}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem
                      key={data?.currency_code}
                      value={data?.currency_code ?? ""}
                    >
                      {data?.currency_name}
                    </SelectItem>
                  )}
                </SelectBar>
                <Input
                  htmlFor="amount"
                  label={`${
                    data?.is_contract ? "Contract" : "Payment"
                  } amount *`}
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
                {data?.is_contract ? (
                  <div className="flex items-center gap-2 mt-3">
                    <Switch
                      id="is_unlimited"
                      name="is_unlimited"
                      checked={isUnlimited}
                      onCheckedChange={setIsUnlimited}
                    />
                    <label htmlFor="is_unlimited">Unlimited amount?</label>
                  </div>
                ) : null}
              </ObjectArray>
              <Separator />
              {/* CHECK IF CONTRACT/PAYMENT IS COMPLETE OR NOT */}
              <div className="flex items-center gap-2 mt-3">
                <Switch
                  id="is_completed"
                  name="is_completed"
                  checked={isComplete}
                  onCheckedChange={setIsComplete}
                />
                <label htmlFor="is_completed">
                  Is this {data?.is_contract ? "contract" : "payment"} complete?
                  *
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
                  onChange={(e) => setUserComment(e.target.value)}
                  value={userComment}
                ></textarea>
              </Input>
              <div className="flex justify-center mt-6 scale-75">
                <Submit
                  loading={loadingEdit}
                  buttonClick={() =>
                    data?.is_contract
                      ? handleEditContract(data?.id)
                      : handleEditPayment(data?.id as string)
                  }
                />
              </div>
            </Popover>
          </form>
        </DialogContent>
      </Dialog>
      {/* DELETE CONTRACT/PAYMENT ITEM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              row and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-darkText">
              Cancel
            </AlertDialogCancel>
            {data ? (
              <AlertDialogAction
                onClick={() => {
                  data?.is_contract
                    ? handleDeleteContract(data?.id, data?.project_id)
                    : handleDeletePayment(data?.id);
                }}
              >
                {loadingDelete ? <Loading /> : "Continue"}
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ActionDialog;

function Detail({
  children,
  title,
  item,
  custom,
  className,
}: {
  readonly children?: React.ReactNode;
  readonly title: string;
  readonly item?: string;
  readonly custom?: boolean;
  readonly className?: string;
}) {
  const render = item ? <Paragraph text={item} /> : null;

  return (
    <div className="mb-4">
      <Header6 text={title} className="capitalize text-darkText font-medium" />
      <div className={`mt-1 text-dark75 text-[14.5px] ${className}`}>
        {custom ? children : render}
      </div>
    </div>
  );
}
