"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculateTransactionResponse } from "../types";

interface CalculationAreaProps {
  calculationResult: CalculateTransactionResponse;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function CalculationArea({ calculationResult }: CalculationAreaProps) {
  const { totalAmount, unitPrice, quantity, apartment, fee, apartmentInfo, feeInfo, formula } = calculationResult;

  const getQuantity = () => {
    if (quantity !== undefined) {
      return quantity.toString();
    }
    if (!apartmentInfo || !feeInfo) return "-";
    
    switch (feeInfo.unit) {
      case "m2":
        return `${apartmentInfo.area} m²`;
      case "person":
        return "1 người";
      case "household":
        return "1 hộ";
      default:
        return "-";
    }
  };

  const getUnitPrice = () => {
    if (unitPrice !== undefined) {
      const unit = feeInfo?.unit || "";
      return unit ? `${formatVND(unitPrice)}/${unit}` : formatVND(unitPrice);
    }
    if (feeInfo) {
      return `${formatVND(feeInfo.amount)}/${feeInfo.unit}`;
    }
    return "-";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả tính toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Đơn giá</p>
            <p className="text-lg font-semibold">
              {getUnitPrice()}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Số lượng</p>
            <p className="text-lg font-semibold">{getQuantity()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Thành tiền</p>
            <p className="text-2xl font-bold text-primary">
              {formatVND(totalAmount)}
            </p>
          </div>
        </div>

        {(apartment || fee) && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Thông tin:</p>
            <div className="text-sm">
              {apartment && (
                <p>
                  <span className="font-medium">Căn hộ:</span> {apartment}
                </p>
              )}
              {fee && (
                <p>
                  <span className="font-medium">Khoản thu:</span> {fee}
                </p>
              )}
            </div>
          </div>
        )}

        {formula && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Công thức:</p>
            <p className="text-sm font-mono bg-muted p-2 rounded">{formula}</p>
          </div>
        )}

        {apartmentInfo && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Thông tin căn hộ:</p>
            <div className="text-sm">
              <p>
                <span className="font-medium">Số phòng:</span> {apartmentInfo.apartmentNumber}
              </p>
              <p>
                <span className="font-medium">Tòa nhà:</span> {apartmentInfo.building}
              </p>
              {apartmentInfo.area && (
                <p>
                  <span className="font-medium">Diện tích:</span> {apartmentInfo.area} m²
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

