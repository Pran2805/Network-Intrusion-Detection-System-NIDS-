from pymongo import MongoClient # type: ignore

DB_URI = "mongodb://localhost:27017/"
DB_NAME = "IDS_DB"
ALERT_COLLECTION = "alerts"

client = MongoClient(DB_URI)
db = client[DB_NAME]
alerts_col = db[ALERT_COLLECTION]

def insert_alerts(alerts_list):
    if alerts_list:
        alerts_col.insert_many(alerts_list)
