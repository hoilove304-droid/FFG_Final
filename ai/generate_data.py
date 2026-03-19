import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

N = 10000

TX_CHANNELS  = ["WEB", "MOBILE", "ATM"]
TX_TYPES     = ["TRANSFER", "WITHDRAW", "DEPOSIT", "PAYMENT"]
COUNTRIES    = ["KR"] * 70 + ["US", "JP", "CN", "RU", "NG", "DE", "FR", "VN", "TH"]
DEVICE_TYPES = ["MOBILE", "PC", "ATM"]
DEVICE_OS    = ["Android", "iOS", "Windows", "macOS", "ATM_OS"]
BANK_CODES   = ["02", "03", "04", "05", "06", "07", "08", "09"]

def random_datetime(start_year=2024, end_year=2026):
    start = datetime(start_year, 1, 1)
    end   = datetime(end_year, 3, 1)
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

def random_ip():
    return f"{random.randint(1,223)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"

def is_night_hour(dt):
    return 0 <= dt.hour < 6

rows = []

for i in range(N):
    bank_code   = random.choice(BANK_CODES)
    tx_channel  = random.choice(TX_CHANNELS)
    tx_type     = random.choice(TX_TYPES)
    tx_datetime = random_datetime()
    tx_country  = random.choice(COUNTRIES)
    tx_location = random.choice(["서울", "부산", "인천", "대구", "광주", "대전", "수원", "해외"])
    device_type = random.choice(DEVICE_TYPES)
    device_os   = random.choice(DEVICE_OS)
    device_id   = f"DEV-{random.randint(1000, 9999)}"
    ip_address  = random_ip()
    user_id     = str(random.randint(1000, 9999))
    tx_amount   = round(np.random.lognormal(mean=11, sigma=1.2), 2)

    # ── 이상거래 점수 계산 ─────────────────────────────────
    fraud_score = 0.0

    if tx_country not in ["KR", "US", "JP"] and tx_amount >= 100000:
        fraud_score += 0.45
    if is_night_hour(tx_datetime) and tx_type == "TRANSFER":
        fraud_score += 0.35
    if tx_channel == "ATM" and tx_type == "WITHDRAW" and tx_amount >= 500000:
        fraud_score += 0.35
    if tx_country in ["RU", "NG"]:
        fraud_score += 0.40
    if is_night_hour(tx_datetime) and tx_country not in ["KR"]:
        fraud_score += 0.30
    if tx_amount >= 5000000:
        fraud_score += 0.25
    if random.random() < 0.05:
        fraud_score += 0.45

    fraud_score += np.random.normal(0, 0.08)
    fraud_score = float(np.clip(fraud_score, 0.0, 1.0))
    fraud_label = 1 if fraud_score >= 0.4 else 0

    if fraud_label == 1:
        tx_amount = round(np.random.lognormal(mean=14, sigma=1.0), 2)

    rows.append({
        "user_id":     user_id,
        "bank_code":   bank_code,
        "tx_channel":  tx_channel,
        "tx_type":     tx_type,
        "tx_amount":   tx_amount,
        "tx_datetime": tx_datetime.strftime("%Y-%m-%d %H:%M:%S"),
        "tx_hour":     tx_datetime.hour,
        "tx_weekday":  tx_datetime.weekday(),
        "tx_country":  tx_country,
        "tx_location": tx_location,
        "device_type": device_type,
        "device_os":   device_os,
        "device_id":   device_id,
        "ip_address":  ip_address,
        "fraud_score": round(fraud_score, 4),
        "fraud_label": fraud_label,
    })

df = pd.DataFrame(rows)

print(f"총 데이터 건수     : {len(df):,}")
print(f"이상거래 건수      : {df['fraud_label'].sum():,} ({df['fraud_label'].mean()*100:.1f}%)")
print(f"정상거래 건수      : {(df['fraud_label']==0).sum():,}")
print(f"평균 거래금액      : {df['tx_amount'].mean():,.0f}원")
print(f"이상거래 평균금액  : {df[df['fraud_label']==1]['tx_amount'].mean():,.0f}원")

df.to_csv("data/transactions.csv", index=False, encoding="utf-8-sig")
print("\n✅ data/transactions.csv 저장 완료")
