import Alert from "../models/alert.model.js";

export const getData = async (req, res) => {
  try {
    const { severity, status, type, from, to } = req.query;
    let filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (from || to) filter.detectedAt = {};
    if (from) filter.detectedAt.$gte = new Date(from);
    if (to) filter.detectedAt.$lte = new Date(to);

    const alerts = await Alert.find(filter).sort({ detectedAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getDataById =  async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateDataById = async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
