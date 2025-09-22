from scapy.all import sniff # pyright: ignore[reportMissingImports]


def packet_capture(packet):
    print(packet)
    # print(packet.summary()) # both working same way so I have choose whole packet rather than it's summary

if __name__ == "__main__":
    print("Packet Capturing Start")
    sniff(prn=packet_capture, count=10)