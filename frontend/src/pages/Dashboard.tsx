import { useEffect, useState } from "react";
import { NetworkVisualization } from "@/components/NetworkVisualization";
import { AlertsTable } from "@/components/AlertsTable";
import { StatsCards } from "@/components/StatsCards";
import { ThreatChart } from "@/components/ThreatChart";
import { RealTimeMonitor } from "@/components/RealTimeMonitor";
import { AlertFilters } from "@/components/AlertFilters";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, AlertTriangle, Eye } from "lucide-react";

export interface Alert {
  id: string;
  timestamp: string;
  sourceIP: string;
  attackType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  blocked: boolean;
}

const Dashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [filters, setFilters] = useState({
    severity: 'all',
    attackType: 'all',
    timeRange: '24h'
  });

  // Simulate WebSocket connection and real-time alerts
  useEffect(() => {
    // Initial demo data
    const initialAlerts: Alert[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        sourceIP: '192.168.1.105',
        attackType: 'Port Scan',
        severity: 'high',
        description: 'Multiple port scan attempts detected',
        blocked: true
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        sourceIP: '10.0.0.42',
        attackType: 'ICMP Flood',
        severity: 'critical',
        description: 'High volume ICMP flood attack detected',
        blocked: true
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sourceIP: '172.16.0.88',
        attackType: 'Anomalous Traffic',
        severity: 'medium',
        description: 'Unusual traffic pattern detected by ML model',
        blocked: false
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sourceIP: '203.0.113.15',
        attackType: 'Brute Force',
        severity: 'high',
        description: 'SSH brute force attack attempt',
        blocked: true
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        sourceIP: '198.51.100.200',
        attackType: 'DDoS',
        severity: 'critical',
        description: 'Distributed denial of service attack detected',
        blocked: true
      }
    ];

    setAlerts(initialAlerts);
    setIsConnected(true);

    // Simulate real-time alerts
    const interval = setInterval(() => {
      const attackTypes = ['Port Scan', 'ICMP Flood', 'Brute Force', 'DDoS', 'Anomalous Traffic', 'SQL Injection'];
      const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
      const ips = ['192.168.1.', '10.0.0.', '172.16.0.', '203.0.113.', '198.51.100.'];
      
      const newAlert: Alert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sourceIP: ips[Math.floor(Math.random() * ips.length)] + (Math.floor(Math.random() * 255) + 1),
        attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: 'Real-time threat detected by IDS system',
        blocked: Math.random() > 0.3
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...alerts];

    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.attackType !== 'all') {
      filtered = filtered.filter(alert => alert.attackType === filters.attackType);
    }

    // Time range filtering
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    if (filters.timeRange !== 'all') {
      const range = timeRanges[filters.timeRange as keyof typeof timeRanges];
      filtered = filtered.filter(alert => 
        now - new Date(alert.timestamp).getTime() <= range
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filters]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Intrusion Detection System
            </h1>
            <p className="text-muted-foreground">Real-time network monitoring dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-secure animate-pulse' : 'bg-destructive'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant="outline" className="border-primary text-primary">
            <Activity className="h-3 w-3 mr-1" />
            Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards alerts={alerts} />

      {/* Real-time Monitor */}
      <RealTimeMonitor alerts={alerts.slice(0, 5)} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3D Network Visualization */}
        <Card className="xl:col-span-2 p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Network Visualization</h3>
            </div>
            <Badge variant="secondary">3D View</Badge>
          </div>
          <div className="h-[400px]">
            <NetworkVisualization alerts={alerts} />
          </div>
        </Card>

        {/* Threat Chart */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="text-lg font-semibold">Threat Analysis</h3>
          </div>
          <ThreatChart alerts={alerts} />
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Security Alerts</h2>
          <Badge variant="outline" className="border-primary text-primary">
            {filteredAlerts.length} Active Alerts
          </Badge>
        </div>

        <AlertFilters filters={filters} onFiltersChange={setFilters} alerts={alerts} />
        
        <AlertsTable alerts={filteredAlerts} />
      </div>
    </div>
  );
};

export default Dashboard;