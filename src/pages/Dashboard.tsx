import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  MapPin, 
  Clock, 
  Monitor, 
  AlertTriangle, 
  CheckCircle,
  LogOut,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch login history
      const { data: logins } = await supabase
        .from("login_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch security alerts
      const { data: alertsData } = await supabase
        .from("security_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setLoginHistory(logins || []);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">Cao</Badge>;
    if (score >= 40) return <Badge className="bg-warning text-warning-foreground">Trung bình</Badge>;
    return <Badge className="bg-success text-success-foreground">Thấp</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return <Badge variant={variants[severity] || "default"}>{severity}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              SecureAuth
            </span>
          </div>
          <Button onClick={signOut} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Chào mừng trở lại!
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng đăng nhập</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loginHistory.length}</div>
              <p className="text-xs text-muted-foreground">30 ngày qua</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cảnh báo</CardTitle>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">Chưa đọc</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">An toàn</div>
              <p className="text-xs text-muted-foreground">Không phát hiện bất thường</p>
            </CardContent>
          </Card>
        </div>

        {/* Security Alerts */}
        {alerts.length > 0 && (
          <Card className="mb-8 border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Cảnh báo bảo mật
              </CardTitle>
              <CardDescription>Các cảnh báo gần đây về tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <AlertTriangle className="w-5 h-5 text-warning mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{alert.message}</p>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(alert.created_at), "PPp", { locale: vi })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login History */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Lịch sử đăng nhập
            </CardTitle>
            <CardDescription>10 lần đăng nhập gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <p className="text-center text-muted-foreground py-8">Đang tải...</p>
            ) : loginHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có lịch sử đăng nhập
              </p>
            ) : (
              <div className="space-y-4">
                {loginHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {record.city || "Unknown"}, {record.country || "Unknown"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          IP: {record.ip_address}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Monitor className="w-4 h-4" />
                          {record.browser} - {record.os}
                        </span>
                        <span>
                          {format(new Date(record.created_at), "PPp", { locale: vi })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getRiskBadge(record.risk_score)}
                      {record.is_suspicious && (
                        <Badge variant="outline" className="text-warning border-warning">
                          Đáng ngờ
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
