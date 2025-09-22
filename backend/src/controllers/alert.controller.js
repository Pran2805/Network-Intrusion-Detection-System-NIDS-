import Alert from '../models/alert.model.js'
import { emitAlert } from "../sockets/index.js";

export const getRecentAlerts = async (req, res) => {
    try {
        const alert = await Alert.find().sort({ timestamp: -1 }).limit(50).lean();
        res.json(alert)
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

export const createAlerts = async (alertsList) => {
    try {
        if (!alertsList || alertsList.length === 0) return;
        const inserted = await Alert.insertMany(alertsList);
        inserted.forEach(alert => emitAlert(alert));
    } catch (err) {
        console.error("Error inserting alerts:", err.message);
    }
}

