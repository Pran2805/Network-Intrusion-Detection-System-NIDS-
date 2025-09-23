import Alert from "../models/alert.model.js"; 


export const recentAnamolies = async (req, res) => {
  try {
    const recentAlerts = await Alert.find()
      .sort({ timestamp: -1 })   
      .limit(50);                

    res.status(200).json({
      success: true,
      count: recentAlerts.length,
      data: recentAlerts,
    });
  } catch (error) {
    console.error("Error fetching recent anomalies:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const pastAnamolies = async (req, res) => {
  try {
    const { startDate, endDate, severity, type } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (severity) query.severity = severity; 
    if (type) query.type = type;            

    const pastAlerts = await Alert.find(query).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: pastAlerts.length,
      data: pastAlerts,
    });
  } catch (error) {
    console.error("Error fetching past anomalies:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
