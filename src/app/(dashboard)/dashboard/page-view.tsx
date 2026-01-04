"use client";

import ReportsArea from "./components/reports-area";

import TransactionList from "./components/transaction-list";
import { DashboardStats } from "./types";

interface DashboardPageViewProps {
  stats?: DashboardStats;
}

const DashboardPageView = ({ stats }: DashboardPageViewProps) => {
  // Use recent transactions directly
  const recentTransactions = stats?.transactions?.recent || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Analytics Dashboard</div>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportsArea stats={stats} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 space-y-6">
          {/* Reaction List - Full Width */}
          <div className="grid grid-cols-1 gap-6">
            <TransactionList
              title="Giao dịch gần đây"
              transactions={recentTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageView;
