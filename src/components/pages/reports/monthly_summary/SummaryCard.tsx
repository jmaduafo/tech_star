import Header2 from "@/components/fontsize/Header2";
import Header5 from "@/components/fontsize/Header5";
import Card from "@/components/ui/cards/MyCard";
import Loading from "@/components/ui/Loading";
import React from "react";

type Summary = {
  readonly title: string;
  readonly content: string | number | undefined;
};

function SummaryCard({ title, content }: Summary) {
  return (
    <Card className="h-[180px]">
      {!content && typeof content !== "number" ? (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="w-[50%]">
            <Header5 text={title} className="capitalize" />
          </div>
          <div className="mt-auto">
            <Header2 text={`${content}`} className="text-right" />
          </div>
        </div>
      )}
    </Card>
  );
}

export default SummaryCard;
