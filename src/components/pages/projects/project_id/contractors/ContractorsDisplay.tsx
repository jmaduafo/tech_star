"use client";
import React, { Fragment, useActionState, useEffect, useState } from "react";
import { Contractor, User } from "@/types/types";
import Card from "@/components/ui/cards/MyCard";
import { EllipsisVertical, Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { country_list } from "@/utils/dataTools";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { createContractor, editContractor } from "@/zod/actions";
import { deleteItem } from "@/firebase/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/ui/Loading";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

function ContractorsDisplay({
  user,
  sort,
  searchValue,
  allContractors,
  filterSearch,
  projectId,
  loading,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly projectId: string;
  readonly loading: boolean;
  readonly allContractors: Contractor[] | undefined;
  readonly filterSearch: Contractor[];
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      createContractor(
        prevState,
        formData,
        { id: user?.id as string, team_id: user?.team_id },
        projectId
      ),
    {
      data: {
        location: "",
        importance: [2.5],
        is_unavailable: false,
        name: "",
        additional: "",
      },
      message: "",
      success: false,
    }
  );

  const [open, setOpen] = useState(false);

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

  const checkAdmin =
    user?.is_owner || user?.role === "admin" ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* BUTTON TO ADD NEW PROJECT; ONLY ADMIN CAN ADD A NEW PROJECT */}
          <button>
            <Card className="h-[200px] text-lightText cursor-pointer flex justify-center items-center hover:opacity-80 duration-300 hover:shadow-md">
              <div className="">
                <div className="flex justify-center">
                  <Plus strokeWidth={1} className="w-16 h-16" />
                </div>
                <Header5 text="Add new contractor" className="text-center" />
              </div>
            </Card>
          </button>
        </DialogTrigger>
        {/* CREATE PROJECT DIALOG POPUP */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a contractor</DialogTitle>
            <DialogDescription>
              Access payments by adding a contractor
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            {/* PROJECT NAME */}
            <Input label="Contractor name *" htmlFor="name">
              <input
                name="name"
                id="name"
                className="form"
                type="text"
                defaultValue={state?.data?.name}
              />
            </Input>
            <div className="mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select contractor location"
                defaultValue={state?.data?.location}
                label="Countries"
                className="w-full"
                name="location"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <div className="mt-4">
              <label htmlFor="importance_level" className="">
                How crucial is contractor to project? (not as crucial to
                extremely crucial)
              </label>
              <p className="text-right text-dark75 text-[13px]">
                {state?.data?.importance}
              </p>
              <Slider
                name="importance"
                id="importance_level"
                defaultValue={state?.data?.importance}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>
            <Input
              label="Any additional information?"
              htmlFor="additional_info"
              className="mt-4 flex flex-col gap-3"
            >
              <textarea
                name="additional"
                id="additional_info"
                className="form"
                defaultValue={state?.data?.additional}
              ></textarea>
            </Input>
            <div className="flex items-center gap-2 mt-3">
              <Switch
                id="status"
                name="status"
                defaultChecked={state?.data?.is_unavailable}
              />
              <label htmlFor="status">Is contractor unavailable?</label>
            </div>
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
          </form>
        </DialogContent>
      </Dialog>
    ) : null;

  const filtered =
    filterSearch?.length && searchValue.length
      ? filterSearch.map((item) => {
          return (
            <Link
              href={`/projects/${item?.project_id}/contractors/${item?.id}`}
              key={item.id}
            >
              <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-80 duration-300 hover:shadow-md">
                <div className="flex flex-col h-full">
                  <Header4 text={item.name} className="capitalize" />
                  <p className="text-[14px] text-light50 italic">
                    {item.location}
                  </p>
                  <div className="mt-auto">
                    {item.is_unavailable ? (
                      <Banner text={"discontinued"} />
                    ) : null}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })
      : null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      {loading
        ? [0, 1, 2, 3, 4, 5].map((each, i) => {
            return (
              <Fragment key={`${each}_${i}`}>
                <Skeleton className="h-[200px] rounded-[40px]" />
              </Fragment>
            );
          })
        : checkAdmin}
      {allContractors?.length && !filterSearch.length && !searchValue.length
        ? allContractors?.map((item) => {
            return (
              <Fragment key={item.id}>
                <Card className="h-[200px] text-lightText hover:opacity-80 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start gap-5">
                      <div>
                        <Link
                          href={`/projects/${item?.project_id}/contractors/${item?.id}`}
                        >
                          <Header4 text={item.name} className="capitalize" />
                        </Link>
                        <p className="text-[14px] text-light50 italic">
                          {item.location}
                        </p>
                      </div>
                      <div>
                        <EditContractor contractor={item} />
                      </div>
                    </div>
                    <div className="mt-auto">
                      {item.is_unavailable ? (
                        <Banner text={"discontinued"} />
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Fragment>
            );
          })
        : filtered}
    </section>
  );
}
export default ContractorsDisplay;

function EditContractor({
  contractor,
}: {
  readonly contractor: Contractor | undefined;
}) {
  const [contractorInfo, setContractorInfo] = useState({
    location: "",
    importance: [2.5],
    is_unavailable: false,
    name: "",
    additional: "",
  });

  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      editContractor(prevState, formData, {
        id: contractor?.id as string,
      }),
    {
      message: "",
      success: false,
    }
  );

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // FOR DELETE CONTRACTOR FUNCTIONALITY
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contractor) {
      setContractorInfo({
        location: contractor?.location ?? "",
        importance: [contractor?.importance_level],
        is_unavailable: contractor?.is_unavailable,
        name: contractor?.name,
        additional: contractor?.text ?? "",
      });
    }
  }, [contractor]);

  useEffect(() => {
    if (!state?.success && state?.message) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title: "Contractor was updated successfully!",
      });
    }
  }, [state]);

  const deleteContractor = async () => {
    setLoading(true);

    try {
      if (!contractor) {
        return;
      }

      await deleteItem("contractors", contractor.id);

      toast({
        title: "Contractor was deleted successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <button>
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
              setDropDownOpen(false);
            }}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setEditOpen(true);
                setDropDownOpen(false);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteOpen(true);
                setEditOpen(false);
                setDropDownOpen(false);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby="edit contractor popup"
          className="sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Edit contractor</DialogTitle>
          </DialogHeader>
          <form action={action}>
            {/* CONTRACTOR NAME */}
            <Input label="Contractor name *" htmlFor="name">
              <input
                name="name"
                id="name"
                className="form"
                type="text"
                value={contractorInfo.name}
                onChange={(e) =>
                  setContractorInfo({ ...contractorInfo, name: e.target.value })
                }
              />
            </Input>
            <div className="mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select contractor location"
                value={contractorInfo.location}
                valueChange={(text) => {
                  setContractorInfo({ ...contractorInfo, location: text });
                }}
                label="Countries"
                className="w-full"
                name="location"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <div className="mt-4">
              <label htmlFor="importance_level" className="">
                How crucial is contractor to project? (not as crucial to
                extremely crucial)
              </label>
              <p className="text-right text-dark75 text-[13px]">
                {contractorInfo.importance}
              </p>
              <Slider
                name="importance"
                id="importance_level"
                value={contractorInfo.importance}
                onValueChange={(val) =>
                  setContractorInfo({ ...contractorInfo, importance: val })
                }
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>
            <Input
              label="Any additional information?"
              htmlFor="additional_info"
              className="mt-4 flex flex-col gap-3"
            >
              <textarea
                name="additional"
                id="additional_info"
                className="form"
                value={contractorInfo.additional}
                onChange={(e) =>
                  setContractorInfo({
                    ...contractorInfo,
                    additional: e.target.value,
                  })
                }
              ></textarea>
            </Input>
            <div className="flex items-center gap-2 mt-3">
              <Switch
                id="status"
                name="status"
                checked={contractorInfo.is_unavailable}
                onCheckedChange={(val) =>
                  setContractorInfo({ ...contractorInfo, is_unavailable: val })
                }
              />
              <label htmlFor="status">Is contractor unavailable?</label>
            </div>
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
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected contractor from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteContractor}>
              {loading ? <Loading className="w-5 h-5" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
