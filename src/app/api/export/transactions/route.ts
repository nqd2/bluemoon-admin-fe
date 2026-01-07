import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// @ts-ignore
import ExcelJS from "exceljs";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.accessToken;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(
      `${backendUrl}/api/transactions/apartments-summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: json.message || "Không thể tải danh sách tổng thu" },
        { status: res.status }
      );
    }

    const summaries = json.data || [];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tổng hợp khoản thu");

    const logoPath = path.join(
      process.cwd(),
      "public/images/logo/horizontal-logo.png"
    );
    try {
      const logoId = workbook.addImage({
        filename: logoPath,
        extension: "png",
      });
      worksheet.addImage(logoId, "A1:B4");
    } catch (e) {
      console.error("Không thể thêm logo vào Excel:", e);
    }

    worksheet.mergeCells("A6:G6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Danh sách tổng khoản thu theo căn hộ";
    titleCell.font = { size: 18, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "STT",
      "Căn hộ",
      "Tòa nhà",
      "Diện tích (m²)",
      "Chủ hộ",
      "Số giao dịch",
      "Tổng thu",
    ]);

    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D4ED8" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const stripe1 = "FFF1F5FF";
    const stripe2 = "FFFFFFFF";

    summaries.forEach((item: any, index: number) => {
      const row = worksheet.addRow([
        index + 1,
        item.name || "",
        item.building || "",
        item.area ?? "",
        item.ownerName || "",
        item.transactionCount ?? 0,
        item.totalCollected ?? 0,
      ]);

      row.getCell(7).numFmt = '#,##0 "₫"';

      const fillColor = index % 2 === 0 ? stripe1 : stripe2;
      row.eachCell((cell: any) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    worksheet.columns = [
      { key: "stt", width: 6 },
      { key: "name", width: 16 },
      { key: "building", width: 10 },
      { key: "area", width: 14 },
      { key: "owner", width: 24 },
      { key: "count", width: 14 },
      { key: "total", width: 18 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="tong_hop_khoan_thu_can_ho.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export transactions excel error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi xuất Excel" },
      { status: 500 }
    );
  }
}


