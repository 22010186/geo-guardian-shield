import { Shield, Lock, Eye, Fingerprint } from "lucide-react";

const features = [
  {
    icon: Shield,
    label: "IP Tracking",
    color: "text-primary",
  },
  {
    icon: Lock,
    label: "Encryption",
    color: "text-secondary",
  },
  {
    icon: Eye,
    label: "Monitoring",
    color: "text-accent",
  },
  {
    icon: Fingerprint,
    label: "2FA Ready",
    color: "text-primary",
  },
];

export const SecurityBadge = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
          >
            <Icon className={`w-4 h-4 ${feature.color}`} />
            <span className="text-sm font-medium text-foreground">{feature.label}</span>
          </div>
        );
      })}
    </div>
  );
};
