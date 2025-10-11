import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { CurrentSessionInfo } from "@/components/dashboard/CurrentSessionInfo";
import { DeviceFingerprint } from "@/components/dashboard/DeviceFingerprint";
import { RiskAnalysisChart } from "@/components/dashboard/RiskAnalysisChart";
import { ActiveSessions } from "@/components/dashboard/ActiveSessions";
import { SecurityInfrastructure } from "@/components/dashboard/SecurityInfrastructure";
import { LoginHistoryTable } from "@/components/dashboard/LoginHistoryTable";

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

interface Session {
  id: string;
  device_name: string;
  location: string;
  ip_address: string;
  is_current: boolean;
  last_used_at: string;
}

interface CurrentSession {
  ip_address: string;
  location: string;
  isp: string;
  browser: string;
  os: string;
  device: string;
  risk_score: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [riskData, setRiskData] = useState<Array<{ date: string; riskScore: number }>>([]);
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

      setLoginHistory(logins || []);

      // Fetch active sessions
      const { data: sessionsData } = await supabase
        .from("trusted_devices")
        .select("*")
        .eq("is_trusted", true)
        .order("last_used_at", { ascending: false });

      setSessions(
        sessionsData?.map((s) => ({
          id: s.id,
          device_name: s.device_name || "Unknown Device",
          location: "Unknown",
          ip_address: "N/A",
          is_current: false,
          last_used_at: s.last_used_at || new Date().toISOString(),
        })) || []
      );

      // Get current session info from most recent login
      if (logins && logins.length > 0) {
        const latest = logins[0];
        setCurrentSession({
          ip_address: latest.ip_address,
          location: `${latest.city || "Unknown"}, ${latest.country || "Unknown"}`,
          isp: latest.isp || "Unknown ISP",
          browser: latest.browser || "Unknown",
          os: latest.os || "Unknown",
          device: "Unknown Device",
          risk_score: latest.risk_score || 0,
        });
      }

      // Calculate risk data for chart (last 6 days)
      const riskByDay: Record<string, number[]> = {};
      logins?.forEach((login) => {
        const date = new Date(login.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!riskByDay[date]) riskByDay[date] = [];
        riskByDay[date].push(login.risk_score || 0);
      });

      const chartData = Object.entries(riskByDay)
        .map(([date, scores]) => ({
          date,
          riskScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        }))
        .slice(0, 6)
        .reverse();

      setRiskData(chartData);
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Advanced Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring and managing your account's security posture.
          </p>
        </div>

        {loadingData ? (
          <p className="text-center text-muted-foreground py-8">Loading dashboard data...</p>
        ) : (
          <div className="space-y-6">
            {/* Login History Table - Full Width */}
            <LoginHistoryTable loginHistory={loginHistory} />

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Active Sessions */}
                <ActiveSessions sessions={sessions} onRevoke={fetchDashboardData} />

                {/* Security Infrastructure */}
                <SecurityInfrastructure />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Current Session Info */}
                {currentSession && (
                  <CurrentSessionInfo
                    ipAddress={currentSession.ip_address}
                    location={currentSession.location}
                    isp={currentSession.isp}
                    riskLevel={currentSession.risk_score}
                  />
                )}

                {/* Device Fingerprint */}
                {currentSession && (
                  <DeviceFingerprint
                    browser={currentSession.browser}
                    os={currentSession.os}
                    device={currentSession.device}
                  />
                )}

                {/* Risk Analysis Chart */}
                {riskData.length > 0 && <RiskAnalysisChart data={riskData} />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
