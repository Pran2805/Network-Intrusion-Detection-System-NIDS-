from datetime import datetime

def detect_signatures(df):
    alerts = []

    port_scan_threshold = 10
    port_counts = df.groupby('src_ip')['dst_port'].nunique()
    for ip, count in port_counts.items():
        if count >= port_scan_threshold:
            alerts.append({
                "timestamp": datetime.utcnow(),
                "src_ip": ip,
                "alert_type": "Port Scan",
                "severity": "high"
            })

    icmp_threshold = 50
    icmp_counts = df[df['protocol']=='ICMP'].groupby('src_ip').size()
    for ip, count in icmp_counts.items():
        if count >= icmp_threshold:
            alerts.append({
                "timestamp": datetime.utcnow(),
                "src_ip": ip,
                "alert_type": "ICMP Flood",
                "severity": "medium"
            })

    return alerts
