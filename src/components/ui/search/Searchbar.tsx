import React from "react";
import { Search } from "lucide-react";

function Searchbar({
  setValue,
  value,
  open,
  children,
  handleSearch
}: {
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly value: string;
  readonly open: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <div className={`bg-light50 backdrop-blur-lg px-2 py-1.5 ${open ? 'rounded-tr-xl rounded-tl-xl' : 'rounded-xl'}`}>
      <div className="flex items-center gap-1 relative">
        <Search className="w-5 text-darkText" />
        <input
          value={value}
          onChange={handleSearch}
          type="text"
          placeholder="Search by project name or location"
          className="placeholder-dark50 text-[15px] py-0"
        />
      </div>
      {open ? (
        <div className="absolute px-2 py-1.5 bg-light70 text-dark75 text-[14px] border-t border-t-light85 left-0 top-full w-full rounded-br-xl rounded-bl-xl">{children}</div>
      ) : null}
    </div>
  );
}

export default Searchbar;
