"use client";
import AddButton from "@/components/ui/buttons/AddButton";
import Searchbar from "@/components/ui/search/Searchbar";
import { User } from "@/types/types";
import Input from "@/components/ui/input/Input";
import React, { useActionState, useEffect, useState } from "react";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import { createStage } from "@/zod/actions";

function StagesSearch({
  user,
  setSort,
  value,
  setValue,
  projectId,
}: {
  readonly user: User | undefined;
  readonly setSort: React.Dispatch<React.SetStateAction<string>>;
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly value: string;
  readonly projectId: string;
}) {
  const [state, action, isLoading] = useActionState(
    (prevState: any, formData: FormData) =>
      createStage(
        prevState,
        formData,
        { id: user?.id as string, team_id: user?.team_id },
        projectId
      ),
    {
      data: {
        name: "",
        desc: "",
      },
      message: "",
      success: false,
    }
  );

  const [open, setOpen] = useState(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);

    !e.target.value.length ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    if (!state?.success && state?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title: "Stage was created successfully!",
      });
    }
  }, [state]);

  return (
    <section>
      <div className="flex items-start gap-3 z-50">
        <div className="flex-1">
          <Searchbar
            setOpen={setOpen}
            handleSearch={handleSearch}
            setValue={setValue}
            value={value}
            open={open}
          />
        </div>
        {/* ONLY ADMIN CAN CREATE A STAGE */}
        <AddButton
          title="stage"
          desc="Add key stages of your project to track progress effectively"
        >
          <form action={action}>
            <Input htmlFor="name" label="Stage name">
              <input
                name="name"
                id="name"
                className="form"
                type="text"
                defaultValue={state?.data?.name}
              />
            </Input>
            <Input htmlFor="desc" label="Description" className="mt-3">
              <textarea
                name="desc"
                id="desc"
                className="form"
                defaultValue={state?.data?.desc}
              ></textarea>
            </Input>
            <div className="flex justify-center mt-6 scale-75">
              <Submit loading={isLoading} />
            </div>
          </form>
        </AddButton>
      </div>
    </section>
  );
}

export default StagesSearch;
