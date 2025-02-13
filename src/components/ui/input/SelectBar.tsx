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
  label,
  className,
}: {
  readonly valueChange?: (value: string) => void ;
  readonly className?: string;
  readonly children: React.ReactNode;
  readonly value: string;
  readonly label: string;
}) {
  return (
    <Select onValueChange={valueChange}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder={`${value}`} />
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
