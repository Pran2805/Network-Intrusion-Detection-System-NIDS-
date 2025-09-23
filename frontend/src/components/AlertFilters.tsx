import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, RefreshCw } from "lucide-react";
import type { Alert } from "@/pages/Dashboard";

interface AlertFiltersProps {
  filters: {
    severity: string;
    attackType: string;
    timeRange: string;
  };
  onFiltersChange: (filters: any) => void;
  alerts: Alert[];
}

export function AlertFilters({ filters, onFiltersChange, alerts }: AlertFiltersProps) {
  const uniqueAttackTypes = [...new Set(alerts.map(alert => alert.attackType))];
  
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      severity: 'all',
      attackType: 'all',
      timeRange: '24h'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-muted-foreground">Severity:</label>
          <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
            <SelectTrigger className="w-32 h-8 text-xs bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span>Critical</span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attack Type Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-muted-foreground">Type:</label>
          <Select value={filters.attackType} onValueChange={(value) => handleFilterChange('attackType', value)}>
            <SelectTrigger className="w-40 h-8 text-xs bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Types</SelectItem>
              {uniqueAttackTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-muted-foreground">Time:</label>
          <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
            <SelectTrigger className="w-32 h-8 text-xs bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}