import React from "react";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header5 from "@/components/fontsize/Header5";
import Header2 from "@/components/fontsize/Header2";
import Header3 from "@/components/fontsize/Header3";
import Header4 from "@/components/fontsize/Header4";

function AmountDisplay() {
  return (
    <div className="">
      <div className="flex gap-4">
        <SelectBar value="Select a project" label="Projects">
          {["Pear", "Corn"].map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectBar>
        <SelectBar value="Select a contractor" label="Contractors">
          {["Pear", "Corn"].map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectBar>
        <SelectBar value="Select a currency" label="Currencies">
          {["Pear", "Corn"].map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectBar>
      </div>
      <div className="mt-6 flex justify-between items-end">
        <div>
        <div className="flex items-start gap-3">
              <Header1 text="9.32b" className="font-semibold" />
              <Header4 text="$" />
            </div>
          <Header5 text="Total Payment Made" />
        </div>
        <div className="flex gap-16">
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="10.27b" className="font-medium" />
              <Header5 text="$" />
            </div>
            <Header5 text="Total Revised Contracts" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="8.56b" className="font-medium" />
              <Header5 text="$" />
            </div>
            <Header5 text="Total Within Contract" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Header2 text="445.37m" className="font-medium" />
              <Header5 text="$" />
            </div>
            <Header5 text="Total Outside Contract" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmountDisplay;
