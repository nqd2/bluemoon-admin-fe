import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
      `${backendUrl}/api/residents?page=1&limit=1000`,
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
        { success: false, message: json.message || "Không thể tải danh sách cư dân" },
        { status: res.status }
      );
    }

    const residents = json.residents || json.data?.residents || [];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách cư dân");

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

    const titleRow = worksheet.addRow([]);
    worksheet.mergeCells("A6:I6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Danh sách cư dân";
    titleCell.font = { size: 18, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "STT",
      "Họ tên",
      "Ngày sinh",
      "Giới tính",
      "Quê quán",
      "Nghề nghiệp",
      "Tình trạng cư trú",
      "Căn hộ",
      "Tòa nhà",
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

    residents.forEach((r: any, index: number) => {
      const apartment = r.apartmentId;
      const row = worksheet.addRow([
        index + 1,
        r.fullName,
        r.dob ? new Date(r.dob) : "",
        r.gender,
        r.hometown || "",
        r.job || "",
        r.residencyStatus || "",
        apartment?.apartmentNumber || "",
        apartment?.building || "",
      ]);

      row.getCell(3).numFmt = "dd/mm/yyyy";

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
      { key: "name", width: 28 },
      { key: "dob", width: 14 },
      { key: "gender", width: 10 },
      { key: "hometown", width: 24 },
      { key: "job", width: 20 },
      { key: "status", width: 18 },
      { key: "apartment", width: 12 },
      { key: "building", width: 10 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="danh_sach_cu_dan.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export residents excel error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi xuất Excel" },
      { status: 500 }
    );
  }
}


