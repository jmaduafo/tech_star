import React from "react";
import { User } from "@/types/types";

import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import Searchbar from "@/components/ui/search/Searchbar";

function ProjectSearch({
  user,
  setSort,
  value,
  setValue,
}: {
  readonly user: User | undefined;
  readonly setSort: React.Dispatch<React.SetStateAction<string>>;
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly value: string;
}) {
  const [open, setOpen] = React.useState(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);

    !e.target.value.length ? setOpen(false) : setOpen(true);
  }

  // Search by: Project name and country / location
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
            {/* <p>{value}</p>
            <div className="py-1.5">
              <p className="">Name</p>
              <div></div>
            </div>
            <div className="border-t border-t-light85 py-1.5">
              <p className="">Location</p>
              <div></div>
            </div> */}
        </div>
        <div className="">
          <SelectBar value="Sort by" label="Sort" valueChange={setSort}>
            {["Sort by activity", "Sort by name"].map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
        </div>
      </div>
    </section>
  );
}

export default ProjectSearch;
