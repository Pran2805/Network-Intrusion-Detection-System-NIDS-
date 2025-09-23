import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    src_ip: {
      type: String,
      required: true,
    },
    dst_ip: {
      type: String,
      required: false, // optional, include if needed
    },
    alert_type: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    protocol: {
      type: String,
      required: false,
    },
    src_port: {
      type: Number,
      required: false,
    },
    dst_port: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
