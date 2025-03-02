import React from "react";
import Header4 from "@/components/fontsize/Header4";
import Paragraph from "@/components/fontsize/Paragraph";
import Banner from "@/components/ui/Banner";
import { User } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical } from "lucide-react";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";

function StagesDisplay({
  user,
  loading,
  sort,
  searchValue,
  projectId,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly projectId: string;
  readonly searchValue: string;
  readonly loading: boolean;
}) {
  const [values, setValues] = React.useState({
    name: "",
    desc: "",
  });

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

  return (
    <section>
      <div className="rounded-3xl bg-light10 backdrop-blur-3xl mb-3">
        <div className="flex justify-between items-center rounded-tr-3xl rounded-tl-3xl py-4 px-5 bg-light25">
          <Header4 text={`Stage I: Soil Investigation & Piling`} />
          {/* EDIT BUTTON */}
          {user?.is_admin ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <EllipsisVertical strokeWidth={1} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44">
                  <DropdownMenuGroup>
                    <Dialog>
                      <DialogTrigger asChild>
                        <p className="text-sm px-2 py-1 border-r-[1.5px] hover:border-r-darkText">Edit</p>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit stage</DialogTitle>
                          <DialogDescription>
                            Make changes to your stage here. Save when you're
                            done.
                          </DialogDescription>
                        </DialogHeader>
                        <form>
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
                          <Input
                            htmlFor="desc"
                            label="Description"
                            className="mt-3"
                          >
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
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
        <div className="py-3 px-5">
          <Paragraph
            className="w-[80%]"
            text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
          />
          <div className="mt-4 flex justify-end">
            <Banner text="completed" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StagesDisplay;
