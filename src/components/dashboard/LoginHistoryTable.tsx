import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface LoginRecord {
  id: string;
  ip_address: string;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  risk_score: number;
  is_suspicious: boolean;
  login_status: string;
  created_at: string;
}

interface LoginHistoryTableProps {
  loginHistory: LoginRecord[];
}

export const LoginHistoryTable = ({ loginHistory }: LoginHistoryTableProps) => {
  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">Critical</Badge>;
    if (score >= 40) return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    return <Badge className="bg-success text-success-foreground">Low</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "success") return <Badge className="bg-success text-success-foreground">Success</Badge>;
    if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
    return <Badge className="bg-warning text-warning-foreground">Requires MFA</Badge>;
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Login History
        </CardTitle>
        <CardDescription>Recent authentication attempts on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No login history available
                  </TableCell>
                </TableRow>
              ) : (
                loginHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.ip_address}</TableCell>
                    <TableCell className="text-sm">
                      {record.city || "Unknown"}, {record.country || "Unknown"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.browser} on {record.os}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.login_status)}</TableCell>
                    <TableCell className="text-right">{getRiskBadge(record.risk_score)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
