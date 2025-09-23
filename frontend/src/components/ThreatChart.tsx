import { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
// import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Alert } from "@/pages/Dashboard";

interface ThreatChartProps {
  alerts: Alert[];
}

export function ThreatChart({ alerts }: ThreatChartProps) {
  const chartData = useMemo(() => {
    // Severity distribution for pie chart
    const severityCount = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityData = Object.entries(severityCount).map(([severity, count]) => ({
      name: severity,
      value: count,
      color: severity === 'critical' ? '#ff4444' :
             severity === 'high' ? '#ff8800' :
             severity === 'medium' ? '#ffaa00' :
             '#44ff88'
    }));

    // Attack type distribution for bar chart
    const attackTypeCount = alerts.reduce((acc, alert) => {
      acc[alert.attackType] = (acc[alert.attackType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const attackTypeData = Object.entries(attackTypeCount).map(([type, count]) => ({
      name: type,
      count,
      blocked: alerts.filter(a => a.attackType === type && a.blocked).length
    }));

    return { severityData, attackTypeData };
  }, [alerts]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Severity Distribution */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">Severity Distribution</h4>
          <Badge variant="outline" className="text-xs">
            {alerts.length} total
          </Badge>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.severityData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {chartData.severityData.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Types */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Attack Types</h4>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.attackTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#888' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#4488ff" radius={[2, 2, 0, 0]} />
              <Bar dataKey="blocked" fill="#44ff88" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded" />
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}