import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectBar({
  valueChange,
  children,
  value,
  placeholder,
  label,
  className,
}: {
  readonly valueChange?: (value: string) => void ;
  readonly className?: string;
  readonly children: React.ReactNode;
  readonly value: string;
  readonly placeholder: string;
  readonly label: string;
}) {
  return (
    <Select value={value} onValueChange={valueChange}>
      <SelectTrigger className={`${className ?? "w-[120px] sm:w-[180px]" }`}>
        <SelectValue placeholder={`${placeholder}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {children}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectBar;
