import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    src_ip: {
        type: String,
        required: true
    },
    alert_type: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
},
    {
        versionKey: false
    });

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;