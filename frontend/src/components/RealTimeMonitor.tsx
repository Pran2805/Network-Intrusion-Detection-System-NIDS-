import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Clock, Zap } from "lucide-react";
import type { Alert } from "@/pages/Dashboard";

interface RealTimeMonitorProps {
  alerts: Alert[];
}

export function RealTimeMonitor({ alerts }: RealTimeMonitorProps) {
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
  }, []);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-destructive border-destructive bg-destructive/10';
      case 'high': return 'text-warning border-warning bg-warning/10';
      case 'medium': return 'text-primary border-primary bg-primary/10';
      case 'low': return 'text-success border-success bg-success/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - alertTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-card via-card to-destructive/5 border border-destructive/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Zap className="h-6 w-6 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Real-Time Monitor</h3>
            <p className="text-sm text-muted-foreground">Latest security events</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-primary text-primary">
            {alertCount} alerts today
          </Badge>
        </div>
      </div>

      {latestAlert ? (
        <div className={`p-4 rounded-lg border transition-all duration-300 ${getSeverityColor(latestAlert.severity)}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-5 w-5 ${latestAlert.severity === 'critical' ? 'text-destructive' : latestAlert.severity === 'high' ? 'text-warning' : 'text-primary'}`} />
              <span className="font-semibold text-sm">
                {latestAlert.attackType} - {latestAlert.severity.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(latestAlert.timestamp)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Source IP</p>
              <p className="font-mono text-sm">{latestAlert.sourceIP}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <div className="flex items-center space-x-1">
                {latestAlert.blocked ? (
                  <>
                    <Shield className="h-3 w-3 text-success" />
                    <span className="text-sm text-success font-medium">Blocked</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    <span className="text-sm text-warning font-medium">Monitoring</span>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm truncate">{latestAlert.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Monitoring network traffic...</p>
          <p className="text-sm text-muted-foreground mt-1">No recent alerts</p>
        </div>
      )}

      {/* Recent alerts preview */}
      {alerts.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Recent Activity</p>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {alerts.slice(1, 4).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-destructive' :
                    alert.severity === 'high' ? 'bg-warning' :
                    alert.severity === 'medium' ? 'bg-primary' : 'bg-success'
                  }`} />
                  <span className="text-muted-foreground">{alert.attackType}</span>
                </span>
                <span className="text-muted-foreground font-mono">{alert.sourceIP}</span>
                <span className="text-muted-foreground">{getTimeAgo(alert.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}