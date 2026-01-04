"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

const AddBlock = ({
  className,
  title = "Storage capacity",
  desc = " Out of your total storage on Premium Plan, you have used up 40%.",
}: {
  className?: string;
  title?: string;
  desc?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-primary dark:bg-default-400 text-primary-foreground pt-5 pb-4 px-4  rounded  m-3 hidden xl:block",
        className
      )}
    >
      <div className={cn("text-base font-semibold text-primary-foreground")}>
        {" "}
        {title}
      </div>
      <div className={cn(" text-sm text-primary-foreground")}>{desc}</div>
      <div className="text-sm font-semibold  text-primary-foreground flex items-center gap-2 mt-4">
        Upgrade Now
        <Icon icon="heroicons:arrow-long-right" className="w-5 h-5" />{" "}
      </div>
    </div>
  );
};

export default AddBlock;
