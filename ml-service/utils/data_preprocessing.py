from sklearn.preprocessing import MinMaxScaler

def normalize_features(features_df):
    scaler = MinMaxScaler()
    numeric_cols = ['packet_count', 'avg_size', 'unique_dst_ips']
    features_df[numeric_cols] = scaler.fit_transform(features_df[numeric_cols])
    
    print("features_df", features_df)
    return features_df