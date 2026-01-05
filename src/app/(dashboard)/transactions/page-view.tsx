"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Calculator, Receipt } from "lucide-react";
import { calculateTransaction, createTransaction } from "@/action/transaction-action";
import toast from "react-hot-toast";
import ApartmentSelect from "./components/apartment-select";
import FeeSelect from "./components/fee-select";
import CalculationArea from "./components/calculation-area";
import type {
  CalculateTransactionResponse,
  CreateTransactionPayload,
} from "./types";

export default function TransactionPageView() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCalculating, setIsCalculating] = useState(false);

  const [apartmentId, setApartmentId] = useState<string>("");
  const [feeId, setFeeId] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<CalculateTransactionResponse | null>(null);
  const [selectedApartmentInfo, setSelectedApartmentInfo] = useState<any>(null);

  const handleCalculate = async () => {
    if (!apartmentId || !feeId) {
      toast.error("Vui lòng chọn căn hộ và khoản thu trước khi tính toán");
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateTransaction({
        apartmentId,
        feeId,
      });

      if (result.success && result.data) {
        setCalculationResult(result.data);
        if (result.data.apartmentInfo?.ownerName && !payerName) {
          setPayerName(result.data.apartmentInfo.ownerName);
        }
        setSelectedApartmentInfo(result.data.apartmentInfo);
        toast.success("Tính toán thành công");
      } else {
        toast.error(result.message || "Không thể tính toán số tiền");
      }
    } catch (error) {
      console.error("Calculate error:", error);
      toast.error("Đã xảy ra lỗi khi tính toán");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apartmentId || !feeId) {
      toast.error("Vui lòng chọn căn hộ và khoản thu");
      return;
    }

    if (!calculationResult || !calculationResult.totalAmount) {
      toast.error("Vui lòng tính toán số tiền trước");
      return;
    }

    if (!payerName.trim()) {
      toast.error("Vui lòng nhập tên người nộp");
      return;
    }

    startTransition(async () => {
      try {
        const payload: CreateTransactionPayload = {
          apartmentId,
          feeId,
          totalAmount: calculationResult.totalAmount,
          payerName: payerName.trim(),
        };

        const result = await createTransaction(payload);

        if (result.success) {
          toast.success(result.message || "Ghi nhận thanh toán thành công");
          
          const savedFeeId = feeId;
          setApartmentId("");
          setFeeId("");
          setPayerName("");
          setCalculationResult(null);
          setSelectedApartmentInfo(null);
          router.push(`/fees/${savedFeeId}`);
        } else {
          toast.error(result.message || "Không thể ghi nhận giao dịch");
        }
      } catch (error) {
        console.error("Create transaction error:", error);
        toast.error("Đã xảy ra lỗi khi ghi nhận giao dịch");
      }
    });
  };

  const handleApartmentChange = (value: string, apartmentInfo?: any) => {
    setApartmentId(value);
    setSelectedApartmentInfo(apartmentInfo);
    setCalculationResult(null);
  };

  const handleFeeChange = (value: string) => {
    setFeeId(value);
    setCalculationResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-default-900">Ghi nhận thanh toán</h1>
          <p className="text-sm text-default-500 mt-1">
            Tính toán và ghi nhận giao dịch đóng phí
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin giao dịch</CardTitle>
            <CardDescription>
              Chọn căn hộ và khoản thu cần ghi nhận thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Căn hộ <span className="text-destructive">*</span>
                </Label>
                <ApartmentSelect
                  value={apartmentId}
                  onChange={handleApartmentChange}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Khoản thu <span className="text-destructive">*</span>
                </Label>
                <FeeSelect value={feeId} onChange={handleFeeChange} />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="button"
                onClick={handleCalculate}
                disabled={!apartmentId || !feeId || isCalculating}
                className="w-full md:w-auto"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tính toán...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Tính toán
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {calculationResult && (
          <>
            <CalculationArea calculationResult={calculationResult} />

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết thanh toán</CardTitle>
                <CardDescription>
                  Điền thông tin người nộp và xác nhận thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Tổng tiền <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculationResult.totalAmount)}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Người nộp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Nhập tên người nộp"
                    disabled={isPending}
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isPending || !payerName.trim()}
                    className="w-full md:w-auto"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Receipt className="mr-2 h-4 w-4" />
                        Xác nhận thanh toán
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </form>
    </div>
  );
}

