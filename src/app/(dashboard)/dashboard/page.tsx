import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/action/dashboard-action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering vì cần access cookies
export const dynamic = "force-dynamic";

// Format date helper
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Format currency helper
function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default async function DashboardPage() {
  const result = await getDashboardStats();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-default-900">Dashboard</h1>
        </div>
        <Alert color="destructive" variant="soft">
          <AlertDescription>
            {result.message || "Không thể tải dữ liệu dashboard"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-default-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Residents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số cư dân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.residents?.total || 0}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Thường trú: {stats.residents?.permanent || 0}</span>
              <span>•</span>
              <span>Tạm trú: {stats.residents?.temporary || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Apartments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số căn hộ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.apartments?.total || 0}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Đã có người: {stats.apartments?.occupied || 0}</span>
              <span>•</span>
              <span>Trống: {stats.apartments?.vacant || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenue?.total ? formatVND(stats.revenue.total) : "0 ₫"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tháng này: {stats.revenue?.thisMonth ? formatVND(stats.revenue.thisMonth) : "0 ₫"}
            </p>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.transactions?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Giao dịch đã ghi nhận
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {stats.transactions?.recent && stats.transactions.recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Căn hộ</TableHead>
                  <TableHead>Loại phí</TableHead>
                  <TableHead>Người nộp</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.transactions.recent.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.apartmentName || transaction.apartmentId}
                    </TableCell>
                    <TableCell>{transaction.feeTitle || "N/A"}</TableCell>
                    <TableCell>{transaction.payerName || "N/A"}</TableCell>
                    <TableCell>{formatVND(transaction.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        color={
                          transaction.status === "Paid" ? "success" : "warning"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!stats.transactions?.recent || stats.transactions.recent.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">
              Chưa có giao dịch nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
