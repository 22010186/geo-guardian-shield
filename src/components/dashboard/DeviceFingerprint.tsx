import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone } from "lucide-react";

interface DeviceFingerprintProps {
  browser: string;
  os: string;
  device: string;
}

export const DeviceFingerprint = ({ browser, os, device }: DeviceFingerprintProps) => {
  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Device Fingerprint</CardTitle>
        <Smartphone className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Browser</span>
          <span className="text-sm font-medium">{browser}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Operating System</span>
          <span className="text-sm font-medium">{os}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            Device
          </span>
          <span className="text-sm font-medium">{device}</span>
        </div>
      </CardContent>
    </Card>
  );
};
