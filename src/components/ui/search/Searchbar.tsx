import React from "react";
import { Search } from "lucide-react";

function Searchbar({
  setValue,
  value,
  open,
  setOpen,
  children,
  handleSearch,
}: {
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly value: string;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly children: React.ReactNode;
}) {
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // THE OPTION LIST CLOSES WHEN USER CLICKS OUT OF SEARCH BAR
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`z-50 relative bg-light50 backdrop-blur-lg px-2 py-1.5 ${
        open ? "rounded-tr-xl rounded-tl-xl" : "rounded-xl"
      }`}
    >
      <div ref={searchRef} className="flex items-center gap-1 relative">
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
        <div className="absolute px-2 py-1.5 bg-light70 backdrop-blur-lg text-dark75 text-[14px] border-t border-t-light90 left-0 top-full w-full rounded-br-xl rounded-bl-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default Searchbar;
