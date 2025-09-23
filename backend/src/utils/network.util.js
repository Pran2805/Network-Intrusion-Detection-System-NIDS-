import Alert from "../models/alert.model.js"; 
 
export const getNetworkTopology = async () => {
  try {
    const alerts = await Alert.find({}, "src_ip dst_ip -_id");

    const nodesSet = new Set();
    const links = [];

    alerts.forEach((alert) => {
      nodesSet.add(alert.src_ip);
      nodesSet.add(alert.dst_ip);

      if (alert.src_ip && alert.dst_ip) {
        links.push({ source: alert.src_ip, target: alert.dst_ip });
      }
    });

    const nodes = Array.from(nodesSet).map((ip) => ({ id: ip }));

    return { nodes, links };
  } catch (error) {
    console.error("Error generating network topology:", error);
    return { nodes: [], links: [] };
  }
};

export const getNetworkTraffic = async () => {
  try {
    const alerts = await Alert.find({}, "src_ip dst_ip severity -_id");

    const traffic = {};

    alerts.forEach((alert) => {
      if (!traffic[alert.src_ip]) traffic[alert.src_ip] = { sent: 0, received: 0, severityCount: {} };
      traffic[alert.src_ip].sent += 1;
      traffic[alert.src_ip].severityCount[alert.severity] = (traffic[alert.src_ip].severityCount[alert.severity] || 0) + 1;

      if (!traffic[alert.dst_ip]) traffic[alert.dst_ip] = { sent: 0, received: 0, severityCount: {} };
      traffic[alert.dst_ip].received += 1;
      traffic[alert.dst_ip].severityCount[alert.severity] = (traffic[alert.dst_ip].severityCount[alert.severity] || 0) + 1;
    });

    const stats = Object.keys(traffic).map((ip) => ({
      ip,
      sent: traffic[ip].sent,
      received: traffic[ip].received,
      severityCount: traffic[ip].severityCount,
    }));

    return stats;
  } catch (error) {
    console.error("Error generating network traffic stats:", error);
    return [];
  }
};
