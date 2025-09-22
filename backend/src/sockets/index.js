import {io} from "../app.js"

export const emitAlert = (alert) => {
    io.emit("new_alert", alert);
    console.log("[*] Alert emitted via WebSocket:", alert);
};