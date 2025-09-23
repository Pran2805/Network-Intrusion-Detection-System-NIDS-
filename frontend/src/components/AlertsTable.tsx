import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, Eye, Ban } from "lucide-react";
import type { Alert } from "@/pages/Dashboard";

interface AlertsTableProps {
  alerts: Alert[];
}

export function AlertsTable({ alerts }: AlertsTableProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground border-warning/50';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getAttackTypeIcon = (attackType: string) => {
    switch (attackType.toLowerCase()) {
      case 'port scan':
        return '🔍';
      case 'icmp flood':
        return '🌊';
      case 'brute force':
        return '🔨';
      case 'ddos':
        return '⚡';
      case 'sql injection':
        return '💉';
      default:
        return '⚠️';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
        <p className="text-muted-foreground">No security alerts match your current filters.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
              <TableHead className="text-foreground font-semibold">Source IP</TableHead>
              <TableHead className="text-foreground font-semibold">Attack Type</TableHead>
              <TableHead className="text-foreground font-semibold">Severity</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Description</TableHead>
              <TableHead className="text-foreground font-semibold w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => {
              const { date, time } = formatTimestamp(alert.timestamp);
              return (
                <TableRow 
                  key={alert.id} 
                  className="border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <TableCell className="font-mono text-sm">
                    <div>
                      <div className="text-foreground">{time}</div>
                      <div className="text-muted-foreground text-xs">{date}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-mono text-sm text-primary">
                    {alert.sourceIP}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAttackTypeIcon(alert.attackType)}</span>
                      <span className="text-sm font-medium">{alert.attackType}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      className={getSeverityColor(alert.severity)}
                      variant="secondary"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {alert.blocked ? (
                        <>
                          <Ban className="h-4 w-4 text-success" />
                          <span className="text-sm text-success font-medium">Blocked</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 text-warning" />
                          <span className="text-sm text-warning font-medium">Monitoring</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.description}
                    </p>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="hover:bg-muted focus:bg-muted">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-muted focus:bg-muted">
                          <Ban className="h-4 w-4 mr-2" />
                          Block IP
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-muted focus:bg-muted">
                          <Shield className="h-4 w-4 mr-2" />
                          Add to Whitelist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination would go here in a real implementation */}
      <div className="p-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Showing {alerts.length} alerts
        </p>
      </div>
    </Card>
  );
}