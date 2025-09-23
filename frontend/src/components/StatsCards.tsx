import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Activity, Ban } from "lucide-react";
import type { Alert } from "@/pages/Dashboard";
import { useEffect, useState } from "react";
import { systemStore } from "@/store/system.store";

interface StatsCardsProps {
  alerts: Alert[];
}

export function StatsCards({ alerts }: StatsCardsProps) {
  const { getMetrics } = systemStore();
  const [metricsData, setMetricsData] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    blockedAlerts: 0,
    last24hAlerts: 0
  });

  // Fetch metrics from backend
  useEffect(() => {
    async function fetchMetrics() {
      const data = await getMetrics();
      if (data) setMetricsData(data);
    }
    fetchMetrics();
  }, [getMetrics]);

  const totalThreats = metricsData.totalAlerts || alerts.length;
  const criticalThreats = metricsData.criticalAlerts || alerts.filter(a => a.severity === 'critical').length;
  const blockedThreats = metricsData.blockedAlerts || alerts.filter(a => a.blocked).length;

  const threatPercentage = totalThreats > 0 ? (criticalThreats / totalThreats) * 100 : 0;
  const blockedPercentage = totalThreats > 0 ? (blockedThreats / totalThreats) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Threats */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Threats</p>
            <p className="text-2xl font-bold text-foreground">{totalThreats}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours: {metricsData.last24hAlerts}</p>
          </div>
          <div className="p-3 bg-primary/20 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Critical Threats */}
      <Card className="p-6 bg-gradient-to-br from-card to-destructive/5 border-border hover:border-destructive/30 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Critical Threats</p>
            <p className="text-2xl font-bold text-destructive">{criticalThreats}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="destructive" className="text-xs">
                {threatPercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
          <div className="p-3 bg-destructive/20 rounded-lg">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Card>

      {/* Blocked Threats */}
      <Card className="p-6 bg-gradient-to-br from-card to-success/5 border-border hover:border-success/30 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Blocked Threats</p>
            <p className="text-2xl font-bold text-success">{blockedThreats}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="text-xs bg-success/20 text-success border-success/30">
                {blockedPercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
          <div className="p-3 bg-success/20 rounded-lg">
            <Ban className="h-6 w-6 text-success" />
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-border hover:border-accent/30 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">System Status</p>
            <p className="text-2xl font-bold text-accent">Active</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Monitoring</span>
            </div>
          </div>
          <div className="p-3 bg-accent/20 rounded-lg">
            <Activity className="h-6 w-6 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  );
}
