import io
import base64
import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import shap
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── 모델·인코더·피처 로드 ────────────────────────────────
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/encoders.pkl", "rb") as f:
    encoders = pickle.load(f)

with open("model/feature_cols.pkl", "rb") as f:
    feature_cols = pickle.load(f)

# SHAP explainer (TreeExplainer = XGBoost 전용, 빠름)
explainer = shap.TreeExplainer(model)

print("✅ 모델 로드 완료")
print(f"   피처: {feature_cols}")


# ── 입력 데이터 전처리 ────────────────────────────────────
def preprocess(data: dict) -> pd.DataFrame:
    """
    React/Spring Boot 에서 넘어오는 거래 데이터를
    모델 입력 형식으로 변환
    """
    from datetime import datetime

    dt_str = data.get("txDatetime", "")
    try:
        dt = datetime.strptime(dt_str.replace("T", " "), "%Y-%m-%d %H:%M")
    except Exception:
        dt = datetime.now()

    tx_hour    = dt.hour
    tx_weekday = dt.weekday()

    row = {
        "tx_channel":  data.get("txChannel", "WEB"),
        "tx_type":     data.get("txType", "TRANSFER"),
        "tx_amount":   float(data.get("txAmount", 0)),
        "tx_hour":     tx_hour,
        "tx_weekday":  tx_weekday,
        "tx_country":  data.get("txCountry", "KR"),
        "tx_location": data.get("txLocation", "서울"),
        "device_type": data.get("deviceType", "PC"),
        "device_os":   data.get("deviceOs", "Windows"),
    }

    df = pd.DataFrame([row])

    # 범주형 인코딩 (학습 때 보지 못한 값은 0으로 처리)
    categorical_cols = [
        "tx_channel", "tx_type", "tx_country",
        "tx_location", "device_type", "device_os"
    ]
    for col in categorical_cols:
        le = encoders.get(col)
        if le is not None:
            val = df[col].astype(str).iloc[0]
            if val in le.classes_:
                df[col] = le.transform([val])
            else:
                df[col] = 0
        else:
            df[col] = 0

    return df[feature_cols]


# ── SHAP 이미지 생성 ──────────────────────────────────────
def make_shap_image(shap_values, feature_names, feature_values) -> str:
    """
    SHAP waterfall 차트를 Base64 PNG 문자열로 반환
    """
    plt.rcParams["font.family"] = "DejaVu Sans"

    fig, ax = plt.subplots(figsize=(8, 5))

    # 피처별 SHAP 값 정렬 (절댓값 기준 내림차순)
    indices = np.argsort(np.abs(shap_values))[::-1]
    top_n   = min(8, len(indices))
    indices = indices[:top_n]

    names  = [feature_names[i] for i in indices]
    values = [shap_values[i]   for i in indices]
    colors = ["#e74c3c" if v > 0 else "#3498db" for v in values]

    bars = ax.barh(names[::-1], values[::-1], color=colors[::-1])
    ax.axvline(0, color="black", linewidth=0.8)
    ax.set_xlabel("SHAP value (이상거래 기여도)")
    ax.set_title("AI 예측 근거 (SHAP)")
    ax.tick_params(axis="y", labelsize=9)

    # 값 라벨
    for bar, val in zip(bars, values[::-1]):
        ax.text(
            val + (0.002 if val >= 0 else -0.002),
            bar.get_y() + bar.get_height() / 2,
            f"{val:+.3f}",
            va="center",
            ha="left" if val >= 0 else "right",
            fontsize=8,
        )

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)

    return img_b64


# ── 엔드포인트 ────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "XGBoost"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        # 전처리
        df_input = preprocess(data)

        # 예측
        prob      = float(model.predict_proba(df_input)[0][1])  # 이상거래 확률
        is_fraud  = int(prob >= 0.5)

        # SHAP
        shap_vals  = explainer.shap_values(df_input)
        shap_row   = shap_vals[0] if shap_vals.ndim == 2 else shap_vals[0]
        shap_image = make_shap_image(
            shap_row,
            feature_cols,
            df_input.iloc[0].tolist(),
        )

        # 피처별 SHAP 값 (프론트에서 텍스트로도 표시 가능)
        shap_detail = {
            feature_cols[i]: round(float(shap_row[i]), 4)
            for i in range(len(feature_cols))
        }

        return jsonify({
            "success":          True,
            "isFraud":          is_fraud,
            "fraudProbability": round(prob * 100, 2),   # % 단위
            "resultText":       "사기 의심 거래" if is_fraud else "정상 거래",
            "shapImage":        shap_image,             # Base64 PNG
            "shapDetail":       shap_detail,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ── 실행 ─────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
