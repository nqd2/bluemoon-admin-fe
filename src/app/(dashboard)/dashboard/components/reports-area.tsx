"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EyeOff, Eye as EyeLucide } from "lucide-react";
import { PersonIcon, HomeIcon, ReaderIcon, BarChartIcon } from "@radix-ui/react-icons";

interface ReportsAreaProps {
  stats?: {
    residents?: {
      total: number;
      permanent: number;
      temporary: number;
    };
    apartments?: {
      total: number;
      occupied: number;
      vacant: number;
    };
    revenue?: {
      total: number;
      thisMonth: number;
      lastMonth: number;
    };
    transactions?: {
      total: number;
    };
  };
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const ReportsArea = ({ stats }: ReportsAreaProps) => {
  const [isShowRevenue, setIsShowRevenue] = useState(false);

  const reports = [
    {
      id: 1,
      name: "Tổng số cư dân",
      count: stats?.residents?.total?.toString() || "0",
      detail: `${stats?.residents?.permanent || 0} thường trú, ${stats?.residents?.temporary || 0} tạm trú`,
      color: "primary",
      icon: <PersonIcon className="w-5 h-5" />,
    },
    {
      id: 2,
      name: "Tổng số căn hộ",
      count: stats?.apartments?.total?.toString() || "0",
      detail: `${stats?.apartments?.occupied || 0} đã có người, ${stats?.apartments?.vacant || 0} trống`,
      color: "success",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      id: 3,
      name: "Tổng doanh thu",
      count: stats?.revenue?.total ? formatVND(stats.revenue.total) : "0 ₫",
      detail: `Tháng này: ${stats?.revenue?.thisMonth ? formatVND(stats.revenue.thisMonth) : "0 ₫"}`,
      color: "info",
      isRevenue: true,
      icon: <ReaderIcon className="w-5 h-5" />,
    },
    {
      id: 4,
      name: "Tổng giao dịch",
      count: stats?.transactions?.total?.toString() || "0",
      detail: "Giao dịch đã ghi nhận",
      color: "warning",
      icon: <BarChartIcon className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {reports.map((item, index) => {
        const isRevenueItem = item.isRevenue;

        return (
          <Card key={`report-card-${index}`}>
            <CardHeader className="flex-col-reverse sm:flex-row flex-wrap gap-2 border-none mb-0 pb-0">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm font-medium text-default-900 whitespace-nowrap">
                  {item.name}
                </span>

                {isRevenueItem && (
                  <button
                    type="button"
                    onClick={() => setIsShowRevenue(!isShowRevenue)}
                    className="text-default-400 hover:text-default-600 transition-colors focus:outline-none flex items-center justify-center"
                    title={isShowRevenue ? "Ẩn doanh thu" : "Hiện doanh thu"}
                  >
                    {isShowRevenue ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <EyeLucide className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              <span
                className={cn(
                  "flex-none h-9 w-9 flex justify-center items-center bg-default-100 rounded-full",
                  {
                    "bg-primary bg-opacity-10 text-primary": item.color === "primary",
                    "bg-info bg-opacity-10 text-info": item.color === "info",
                    "bg-warning bg-opacity-10 text-warning": item.color === "warning",
                    "bg-success bg-opacity-10 text-success": item.color === "success",
                    "bg-destructive bg-opacity-10 text-destructive": item.color === "destructive",
                  }
                )}
              >
                {item.icon}
              </span>
            </CardHeader>

            <CardContent className="pb-4 px-4">
              <div
                onClick={() => {
                  if (isRevenueItem && !isShowRevenue) {
                    setIsShowRevenue(true);
                  }
                }}
                className={cn(
                  "text-2xl font-semibold text-default-900 mb-2.5 transition-all duration-300",
                  isRevenueItem && !isShowRevenue && "filter blur-lg select-none cursor-pointer"
                )}
              >
                {item.count}
              </div>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default ReportsArea;

