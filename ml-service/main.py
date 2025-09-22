from scapy.all import sniff, IP, TCP, UDP  # type: ignore
from datetime import datetime
import pandas as pd

from utils.feature_extraction import extract_features  
from utils.data_preprocessing import normalize_features
from sklearn.ensemble import IsolationForest

from pymongo import MongoClient # type: ignore
import joblib
import threading

BATCH_SIZE = 50
TEMP = []
DB_URI="mongodb://localhost:27017/"
DB_NAME = "IDS_DB"
ALERT_COLLECTION = "alerts"

client = MongoClient(DB_URI)
db = client[DB_NAME]
alerts_col = db[ALERT_COLLECTION]

# model = IsolationForest(contamination=0.05, random_state=42)
try:
    model = joblib.load("isolation_forest_model.pkl")
except:
    model = IsolationForest(contamination=0.05, random_state=42)

def packet_capture(packet):
    if IP in packet:
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        if TCP in packet:
            protocol = "TCP"
            src_port = packet[TCP].sport
            dst_port = packet[TCP].dport
        elif UDP in packet:
            protocol = "UDP"
            src_port = packet[UDP].sport
            dst_port = packet[UDP].dport
        else:
            protocol = str(packet[IP].proto)
            src_port = dst_port = None

        size = len(packet)
        timestamp = datetime.now().isoformat()

        # Add to TEMP batch
        TEMP.append({
            "timestamp": timestamp,
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "protocol": protocol,
            "src_port": src_port,
            "dst_port": dst_port,
            "size": size
        })

        # Process batch when reached BATCH_SIZE
        if len(TEMP) >= BATCH_SIZE:
            # process_batch(TEMP)
            threading.Thread(target=process_batch, args=(TEMP.copy(),)).start()
            TEMP.clear()

def process_batch(batch):
    df = pd.DataFrame(batch)
    features_df = extract_features(df)
    features_df = normalize_features(features_df)
    
    preds = model.fit_predict(features_df[['packet_count','avg_size','unique_dst_ips']])

    features_df['anomaly'] = preds
    anomalies = features_df[features_df['anomaly'] == -1]

    if not anomalies.empty:
        print("[!] Anomalies detected:")
        print(anomalies)
    else:
        print("[*] No anomalies in this batch")

def flush_remaining():
    if TEMP:
        process_batch(TEMP)
        TEMP.clear()

if __name__ == "__main__":
    print("[*] Live Packet Capture Started")
    try:
        # sniff(prn=packet_capture, store=False)  # Real-world scenario
        sniff(prn=packet_capture, count=10)  # For testing only
        flush_remaining()
    except KeyboardInterrupt:
        print("\n[*] Capture stopped by user")
        flush_remaining()
    finally:
        print("[*] IDS Process Ends")
