"use client";
import AddButton from "@/components/ui/buttons/AddButton";
import Searchbar from "@/components/ui/search/Searchbar";
import { User } from "@/types/types";
import Input from "@/components/ui/input/Input";
import React from "react";
import Submit from "@/components/ui/buttons/Submit";
import { CreateStagesSchema } from "@/zod/validation";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/firebase/actions";
import { serverTimestamp } from "firebase/firestore";

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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [values, setValues] = React.useState({
    name: "",
    desc: "",
  });

  const { toast } = useToast();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);

    !e.target.value.length ? setOpen(false) : setOpen(true);
  }

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  async function addStage(formData: FormData) {
    const stageName = formData.get("name");
    const stageDesc = formData.get("desc");

    const values = {
      name: stageName,
      description: stageDesc,
    };

    const result = CreateStagesSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result?.error?.issues[0]?.message,
      });

      return;
    }

    const { name, description } = result.data;

    setLoading(true);

    try {
      if (!user) {
        return;
      }

      await addItem("stages", {
        name: name.trim(),
        description: description.trim(),
        team_id: user?.team_id,
        project_id: projectId,
        is_completed: false,
        created_at: serverTimestamp(),
        updated_at: null,
      });

      toast({
        variant: "default",
        title: "Project created succesfully!",
      });

      setValues({
        name: "",
        desc: "",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }

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
        {user?.is_admin ? (
          <div>
            <AddButton
              buttonTitle="stages"
              title="stage"
              desc="Add key stages of your project to track progress effectively"
            >
              <form action={addStage}>
                <Input htmlFor="name" label="Stage name">
                  <input
                    name="name"
                    id="name"
                    className="form"
                    type="text"
                    onChange={handleChange}
                    value={values.name}
                  />
                </Input>
                <Input htmlFor="desc" label="Description" className="mt-3">
                  <textarea
                    name="desc"
                    id="desc"
                    className="form"
                    onChange={handleChange}
                    value={values.desc}
                  ></textarea>
                </Input>
                <div className="flex justify-center mt-6 scale-75">
                  <Submit loading={loading} />
                </div>
              </form>
            </AddButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default StagesSearch;
