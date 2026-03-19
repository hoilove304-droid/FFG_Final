import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier

# ── 데이터 로드 ───────────────────────────────────────────
df = pd.read_csv("data/transactions.csv")
print(f"데이터 로드: {len(df):,}건  (이상거래: {df['fraud_label'].sum():,}건)")

# ── 피처 엔지니어링 ───────────────────────────────────────
# 사용할 피처 컬럼
FEATURE_COLS = [
    "tx_channel",
    "tx_type",
    "tx_amount",
    "tx_hour",
    "tx_weekday",
    "tx_country",
    "tx_location",
    "device_type",
    "device_os",
]

# 범주형 컬럼 Label Encoding
CATEGORICAL_COLS = [
    "tx_channel", "tx_type", "tx_country",
    "tx_location", "device_type", "device_os"
]

encoders = {}
for col in CATEGORICAL_COLS:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

X = df[FEATURE_COLS]
y = df["fraud_label"]

# ── 학습/테스트 분리 ──────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n학습 데이터: {len(X_train):,}건")
print(f"테스트 데이터: {len(X_test):,}건")

# ── XGBoost 학습 ──────────────────────────────────────────
# 클래스 불균형 처리: scale_pos_weight
neg = (y_train == 0).sum()
pos = (y_train == 1).sum()
scale = neg / pos
print(f"\n클래스 비율 (neg/pos): {scale:.1f}")

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=scale,  # 불균형 보정
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=42,
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False,
)

# ── 평가 ──────────────────────────────────────────────────
y_pred      = model.predict(X_test)
y_pred_prob = model.predict_proba(X_test)[:, 1]

print("\n── 분류 리포트 ──────────────────────────────")
print(classification_report(y_test, y_pred, target_names=["정상", "이상거래"]))
print(f"AUC-ROC: {roc_auc_score(y_test, y_pred_prob):.4f}")

# ── 피처 중요도 ───────────────────────────────────────────
importance = pd.Series(model.feature_importances_, index=FEATURE_COLS)
print("\n── 피처 중요도 ──────────────────────────────")
print(importance.sort_values(ascending=False).to_string())

# ── 모델 저장 ─────────────────────────────────────────────
os.makedirs("model", exist_ok=True)

with open("model/model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("model/encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

with open("model/feature_cols.pkl", "wb") as f:
    pickle.dump(FEATURE_COLS, f)

print("\n✅ model/model.pkl 저장 완료")
print("✅ model/encoders.pkl 저장 완료")
print("✅ model/feature_cols.pkl 저장 완료")
