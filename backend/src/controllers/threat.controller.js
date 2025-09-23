import Threat from "../models/threat.model.js";

export const getStatistics = async (req, res) => {
  try {
    const stats = await Threat.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export const getTypes = async (req, res) => {
  try {
    const types = await Threat.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}