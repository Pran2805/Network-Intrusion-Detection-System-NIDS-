from pymongo import MongoClient # type: ignore
from datetime import datetime

DB_URI = "mongodb://localhost:27017/"
DB_NAME = "IDS_DB"
ALERT_COLLECTION = "alerts"

client = MongoClient(DB_URI)
db = client[DB_NAME]
alerts_col = db[ALERT_COLLECTION]

alerts_col.create_index("timestamp", expireAfterSeconds=7*24*60*60) # 7 days expiry

ALERT_BUFFER = []

def insert_alerts(alerts_list, batch_size=50):
    global ALERT_BUFFER
    if alerts_list:
        for alert in alerts_list:
            if 'timestamp' not in alert:
                alert['timestamp'] = datetime.utcnow()
        ALERT_BUFFER.extend(alerts_list)
        if len(ALERT_BUFFER) >= batch_size:
            alerts_col.insert_many(ALERT_BUFFER)
            ALERT_BUFFER.clear()
