import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface InfrastructureItem {
  name: string;
  description: string;
  status: "active" | "inactive";
}

const infrastructureItems: InfrastructureItem[] = [
  {
    name: "Web Application Firewall (WAF)",
    description: "Blocks malicious traffic and attacks.",
    status: "active",
  },
  {
    name: "Adaptive MFA",
    description: "Requires extra verification for risky logins.",
    status: "active",
  },
  {
    name: "Rate Limiting",
    description: "Prevents brute-force attacks.",
    status: "active",
  },
  {
    name: "Geo-IP Fencing",
    description: "Restricts access from unauthorized regions.",
    status: "inactive",
  },
];

export const SecurityInfrastructure = () => {
  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Security Infrastructure Status</CardTitle>
        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {infrastructureItems.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
          >
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
            <Badge
              variant={item.status === "active" ? "default" : "secondary"}
              className={item.status === "active" ? "bg-success text-success-foreground" : ""}
            >
              {item.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
