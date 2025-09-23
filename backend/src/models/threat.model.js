// models/threat.model.js
import mongoose from "mongoose";

const threatSchema = new mongoose.Schema({
  type: { 
    type: String,
     required: true 
    },
  severity: { 
    type: String, 
    enum: ["low","medium","high","critical"], 
    required: true 
},
  detectedAt: { 
    type: Date, 
    default: Date.now 
},
  sourceIP: String,
  targetIP: String,
  description: String
});

const Threat =  mongoose.model("Threat", threatSchema);
export default Threat
