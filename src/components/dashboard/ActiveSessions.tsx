import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Laptop } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Session {
  id: string;
  device_name: string;
  location: string;
  ip_address: string;
  is_current: boolean;
  last_used_at: string;
}

interface ActiveSessionsProps {
  sessions: Session[];
  onRevoke: () => void;
}

export const ActiveSessions = ({ sessions, onRevoke }: ActiveSessionsProps) => {
  const handleRevoke = async (sessionId: string) => {
    try {
      await supabase.from("trusted_devices").delete().eq("id", sessionId);
      toast.success("Session revoked successfully");
      onRevoke();
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("Failed to revoke session");
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes("iphone") || deviceName.toLowerCase().includes("android")) {
      return <Smartphone className="w-5 h-5" />;
    }
    if (deviceName.toLowerCase().includes("macbook") || deviceName.toLowerCase().includes("laptop")) {
      return <Laptop className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Active Sessions</CardTitle>
        <Monitor className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="flex items-start gap-3">
              {getDeviceIcon(session.device_name)}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{session.device_name}</p>
                  {session.is_current && (
                    <Badge variant="secondary" className="text-xs">Current device</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {session.location} - {session.ip_address}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last active: {new Date(session.last_used_at).toLocaleString()}
                </p>
              </div>
            </div>
            {!session.is_current && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRevoke(session.id)}
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
