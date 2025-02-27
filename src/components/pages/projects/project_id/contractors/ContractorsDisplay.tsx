"use client";
import React, { Fragment } from "react";
import { Contractor, User } from "@/types/types";
import Card from "@/components/ui/MyCard";
import { Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { CreateContractorSchema } from "@/zod/validation";
import { toast } from "@/hooks/use-toast";
import { addItem } from "@/firebase/actions";
import { serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

function ContractorsDisplay({
  user,
  loading,
  sort,
  searchValue,
  allContractors,
  filterSearch,
  projectId,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly loading: boolean;
  readonly projectId: string;
  readonly allContractors: Contractor[] | undefined;
  readonly filterSearch: Contractor[];
}) {
  const [contractorLocation, setContractorLocation] = React.useState("");
  const [importance, setImportance] = React.useState([2.5]);
  const [isUnavailable, setIsUnavailable] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  async function createContractor(formData: FormData) {
    const contractor_name = formData.get("name");
    const contractor_additional = formData.get("additional");

    const values = {
      name: contractor_name,
      importance_level: importance[0],
    };

    const result = CreateContractorSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result?.error?.issues[0]?.message,
      });

      return;
    }

    const { name, importance_level } = result.data;

    setIsLoading(true)

    try {
      if (!user || !projectId) {
        return;
      }


      await addItem("contractors", {
        name,
        team_id: user?.team_id,
        project_id: projectId,
        location: contractorLocation ?? null,
        importance_level,
        text: contractor_additional ?? null,
        is_unavailaible: isUnavailable ?? false,
        created_at: serverTimestamp(),
        updated_at: null,
      });

      setOpen(false);

      toast({
        variant: "default",
        title: "Contractor created succesfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err?.message,
      });
    } finally {
      setIsLoading(false)
    }
  }

  const checkAdmin = user?.is_admin ? (
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
        <form action={createContractor}>
          {/* PROJECT NAME */}
          <Input label="Contractor name *" htmlFor="name">
            <input name="name" id="name" className="form" type="text" />
          </Input>
          <div className="mt-5">
            {/* COUNTRY LOCATION */}
            <SelectBar
              value="Select contractor location "
              valueChange={setContractorLocation}
              label="Countries"
              className="w-full"
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
              How crucial is contractor to project? (not as crucial to extremely
              crucial)
            </label>
            <p className="text-right text-dark75 text-[13px]">{importance}</p>
            <Slider
              name="importance"
              id="importance_level"
              defaultValue={[2.5]}
              value={importance}
              onValueChange={setImportance}
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
            ></textarea>
          </Input>
          <Input
            label="Is contractor unavailable?"
            htmlFor="status"
            className="mt-4 flex items-center justify-end gap-3"
          >
            <Switch
              id="status"
              name="status"
              onCheckedChange={setIsUnavailable}
              checked={isUnavailable}
            />
          </Input>

          <div className="flex justify-center mt-6 scale-75">
            <Submit loading={isLoading} />
          </div>
        </form>
        <DialogFooter className=""></DialogFooter>
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
    <section className="grid grid-cols-3 gap-5 w-full">
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
        : filtered}
    </section>
  );
}
export default ContractorsDisplay;
