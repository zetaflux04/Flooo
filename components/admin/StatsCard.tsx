import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  iconBg: string;
}

export default function StatsCard({ title, value, change, positive, icon: Icon, iconBg }: StatsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm">{title}</p>
          <p className="text-2xl font-bold text-secondary mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${positive ? "text-green-600" : "text-red-500"}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
