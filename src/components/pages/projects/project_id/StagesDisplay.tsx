import Header4 from "@/components/fontsize/Header4";
import Paragraph from "@/components/fontsize/Paragraph";
import Banner from "@/components/ui/Banner";
import { User } from "@/types/types";
import React from "react";

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
  return (
    <section>
      <div className="rounded-3xl bg-light10 backdrop-blur-3xl">
        <div className="rounded-tr-3xl rounded-tl-3xl py-4 px-5 bg-light25">
          <Header4 text={`Stage I: Soil Investigation & Piling`} />
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
