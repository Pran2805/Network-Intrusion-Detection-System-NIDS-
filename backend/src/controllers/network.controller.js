import { getNetworkTopology, getNetworkTraffic } from "../utils/network.util.js";

export const NetworkTopology = async (_, res) => {
  try {
    const topology = await getNetworkTopology(); 
    res.status(200).json({ success: true, data: topology });
  } catch (error) {
    console.error("Error fetching network topology:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const NetworkTraffic = async (_, res) => {
  try {
    const trafficStats = await getNetworkTraffic(); 
    res.status(200).json({ success: true, data: trafficStats });
  } catch (error) {
    console.error("Error fetching network traffic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}