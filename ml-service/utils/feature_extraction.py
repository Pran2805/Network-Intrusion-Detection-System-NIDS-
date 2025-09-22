import pandas as pd

def extract_features(packets_df):
    freq = packets_df.groupby('src_ip').size().reset_index(name='packet_count')
    avg_size = packets_df.groupby('src_ip')['size'].mean().reset_index(name='avg_size')
    unique_dst = packets_df.groupby('src_ip')['dst_ip'].nunique().reset_index(name='unique_dst_ips')
    features = freq.merge(avg_size, on='src_ip').merge(unique_dst, on='src_ip')
    
    print("freq", freq)
    print("avg_size", avg_size)
    print("unique_dst", unique_dst)
    print("features", features)
    return features
