import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Shield } from "lucide-react";

interface CurrentSessionInfoProps {
  ipAddress: string;
  location: string;
  isp: string;
  riskLevel: number;
}

export const CurrentSessionInfo = ({ ipAddress, location, isp, riskLevel }: CurrentSessionInfoProps) => {
  const getRiskBadge = () => {
    if (riskLevel >= 70) return <Badge variant="destructive">Critical</Badge>;
    if (riskLevel >= 40) return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    return <Badge className="bg-success text-success-foreground">Low</Badge>;
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Current Session Info</CardTitle>
        <Shield className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">IP Address</span>
          <span className="font-mono text-sm">{ipAddress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location
          </span>
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            ISP
          </span>
          <span className="text-sm">{isp}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Risk Level</span>
          {getRiskBadge()}
        </div>
      </CardContent>
    </Card>
  );
};
