"use client";

import ReportsArea from "./components/reports-area";

import TransactionList from "./components/transaction-list";
import { DashboardStats } from "./types";

interface DashboardPageViewProps {
  stats?: DashboardStats;
}

const DashboardPageView = ({ stats }: DashboardPageViewProps) => {
  const recentTransactions = stats?.transactions?.recent || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-bold text-white">Bảng số liệu</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportsArea stats={stats} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6">
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
