"use client";

import React from "react";
import TransactionsSummaryTable from "./components/transactions-summary-table";

export default function TransactionPageView() {
  return (
    <div className="space-y-6">
      <TransactionsSummaryTable />
    </div>
  );
}

