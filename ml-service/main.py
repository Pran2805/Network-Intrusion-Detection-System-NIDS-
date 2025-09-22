from scapy.all import sniff, IP, TCP, UDP # type: ignore
from datetime import datetime
import os
import pandas as pd

OUTPUT_FILE = "./dataset/packets.csv"
BATCH_SIZE=50
TEMP = []


if not os.path.exists(OUTPUT_FILE):
    pd.DataFrame(columns=["timestamp", "src_ip", "dst_ip", "protocol","src_port", "dst_port", "size"]).to_csv(OUTPUT_FILE, index=False)

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
        # print(f"[{timestamp}] {protocol} {src_ip}:{src_port} -> {dst_ip}:{dst_port} | Size: {size} bytes")
        return {
            "timestamp": timestamp,
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "protocol": protocol,
            "src_port": src_port,
            "dst_port": dst_port,
            "size": size
        }

def write_csv(packet):
    data = packet_capture(packet)
    if data:
        TEMP.append(data)
        if len(TEMP) >= BATCH_SIZE:
            
            pd.DataFrame(TEMP).to_csv(
                OUTPUT_FILE, mode="a", header=False, index=False
            )
            TEMP.clear()
            print(f"[+] Saved {BATCH_SIZE} packets")
        
def flush_remaining():
    if TEMP:
        pd.DataFrame(TEMP).to_csv(OUTPUT_FILE, mode="a", header=False, index=False)
        print(f"[+] Saved remaining {len(TEMP)} packets")
        TEMP.clear()

if __name__ == "__main__":
    print("Packet Capturing Start")
    try:
        # sniff(prn=write_csv, store=False) #real world scenario
        sniff(prn=write_csv, count=10)  # For testing only
    except KeyboardInterrupt:
        pass
    finally:
        flush_remaining()  
        print("Capture finished and CSV saved.")