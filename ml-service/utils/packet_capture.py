from scapy.all import sniff, IP, TCP, UDP  # type: ignore
from datetime import datetime
import pandas as pd
from utils.feature_extraction import extract_features
from utils.data_preprocessing import normalize_features
from sklearn.ensemble import IsolationForest
import joblib
import threading
from db.index import insert_alerts
from utils.packet_signature import detect_signatures
BATCH_SIZE = 200
TEMP = []

try:
    model = joblib.load("isolation_forest_model.pkl")
    print("[*] Loaded pre-trained Isolation Forest model.")
    model_fitted = True
except:
    model = IsolationForest(contamination=0.05, random_state=42)
    print("[*] No pre-trained model found. Will fit on first batch.")
    model_fitted = False

def process_batch(batch):
    global model_fitted
    df = pd.DataFrame(batch)
    
    print("\n[*] Batch Packets:")
    print(df)
    
    features_df = extract_features(df)
    print("\n[*] Features:")
    print(features_df)

    features_df = normalize_features(features_df)
    print("\n[*] Normalized Features:")
    print(features_df)
    
    X = features_df[['packet_count','avg_size','unique_dst_ips']]

    if not model_fitted:
        model.fit(X)
        model_fitted = True
        joblib.dump(model, "isolation_forest_model.pkl")
        print("[*] Model trained on first batch and saved.")

    preds = model.predict(X)
    features_df['anomaly'] = preds
    anomalies = features_df[features_df['anomaly'] == -1]

    if not anomalies.empty:
        print("[!] Anomalies detected:")
        print(anomalies)
        insert_alerts(anomalies.to_dict('records'))
    else:
        print("[*] No anomalies in this batch.")
        
    signature_alerts = detect_signatures(df)
    if signature_alerts:
         threading.Thread(target=insert_alerts, args=(signature_alerts,)).start()
         print(f"[!] {len(signature_alerts)} signature alerts detected and stored.")

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

        TEMP.append({
            "timestamp": datetime.now().isoformat(),
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "protocol": protocol,
            "src_port": src_port,
            "dst_port": dst_port,
            "size": len(packet)
        })

        if len(TEMP) >= BATCH_SIZE:
            threading.Thread(target=process_batch, args=(TEMP.copy(),)).start()
            TEMP.clear()

def flush_remaining():
    if TEMP:
        process_batch(TEMP)
        TEMP.clear()

def start_capture():
    print("[*] Live Packet Capture Started")
    try:
        sniff(prn=packet_capture, store=False)  # continuous live capture
        # sniff(prn=packet_capture, count=300) 
    except KeyboardInterrupt:
        print("\n[*] Capture stopped by user")
        flush_remaining()
    finally:
        print("[*] IDS Process Ends")
