import json
from pathlib import Path
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "historical_data"
TRAIN_FILES = [
    DATA_DIR / "VOO_2011.csv",
    DATA_DIR / "VOO_2012.csv"
]
PATTERN_FILE = DATA_DIR / "pattern_analysis.csv"
CONFIG_FILE = DATA_DIR / "strategy_config.json"
WINDOW_SIZE = 14
ENTRY_CANDIDATES = [1.2, 1.5, 1.8, 2.0, 2.2, 2.5]
EXIT_THRESHOLD = 0.4
STOP_LOSS_THRESHOLD = 2.5
TIME_STOP_MINUTES = 120
FUTURE_MINUTES = [5, 15, 30, 60]

def clean_data(df):
    df = df.rename(columns={
        "t": "datetime",
        "o": "open",
        "h": "high",
        "l": "low",
        "c": "close",
        "v": "volume"
    }).copy()
    if "datetime" not in df.columns:
        if "time" in df.columns:
            df = df.rename(columns={"time": "datetime"})
        else:
            raise ValueError("Cannot find datetime column.")
    if pd.api.types.is_numeric_dtype(df["datetime"]):
        df["datetime"] = (
            pd.to_datetime(df["datetime"], unit="ms", utc=True)
            .dt.tz_convert("America/New_York")
            .dt.tz_localize(None)
        )
    else:
        df["datetime"] = pd.to_datetime(
            df["datetime"],
            errors="coerce",
            format="mixed"
        )
    for col in ["open", "high", "low", "close"]:
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")
        df[col] = pd.to_numeric(df[col], errors="coerce")
    if "volume" in df.columns:
        df["volume"] = pd.to_numeric(df["volume"], errors="coerce")
    df = df.dropna(subset=["datetime", "open", "high", "low", "close"])
    df = df[
        (df["open"] > 0) &
        (df["high"] > 0) &
        (df["low"] > 0) &
        (df["close"] > 0)
    ]
    df = df[
        (df["high"] >= df[["open", "close", "low"]].max(axis=1)) &
        (df["low"] <= df[["open", "close", "high"]].min(axis=1))
    ]
    df = (
        df.drop_duplicates("datetime", keep="last")
        .sort_values("datetime")
        .reset_index(drop=True)
    )
    df["session_date"] = df["datetime"].dt.date
    return df

def load_data():
    frames = []
    for file in TRAIN_FILES:
        if not file.exists():
            raise FileNotFoundError(file)
        print("Loading:", file.name)
        frames.append(pd.read_csv(file))
    return clean_data(pd.concat(frames, ignore_index=True))

def calculate_z_score(prices):
    prices = pd.Series(prices).tail(WINDOW_SIZE)
    if len(prices) < WINDOW_SIZE:
        return np.nan, np.nan, np.nan
    mean = prices.mean()
    std = prices.std(ddof=0)
    z = 0 if std == 0 else (prices.iloc[-1] - mean) / std
    return float(z), float(mean), float(std)

def make_decision(history, entry_threshold):
    z, mean, std = calculate_z_score(history["close"])
    price = float(history["close"].iloc[-1])
    return {
        "price": price,
        "mean": mean,
        "std": std,
        "z_score": z,
        "decision": "BUY" if z < -entry_threshold else "DO_NOT_BUY"
    }

def add_features(df):
    df = df.copy()
    df["mean"] = (
        df["close"]
        .rolling(WINDOW_SIZE, min_periods=WINDOW_SIZE)
        .mean()
    )
    df["std"] = (
        df["close"]
        .rolling(WINDOW_SIZE, min_periods=WINDOW_SIZE)
        .std(ddof=0)
    )
    df["z_score"] = (
        (df["close"] - df["mean"])
        / df["std"]
    )
    df.loc[df["std"] == 0, "z_score"] = 0
    df["entry_price"] = df["open"].shift(-1)
    for minutes in FUTURE_MINUTES:
        future_close = df["close"].shift(-(minutes + 1))

        df[f"return_{minutes}m_pct"] = (
            (future_close / df["entry_price"]) - 1
        ) * 100
    return df

def find_pattern(df):
    df = add_features(df)
    results = []
    for threshold in ENTRY_CANDIDATES:
        signals = df[df["z_score"] < -threshold]
        row = {
            "entry_threshold": threshold,
            "signal_count": len(signals)
        }
        for minutes in FUTURE_MINUTES:
            returns = signals[f"return_{minutes}m_pct"].dropna()
            row[f"avg_{minutes}m_pct"] = returns.mean()
            row[f"win_rate_{minutes}m_pct"] = (returns > 0).mean() * 100
        results.append(row)
    result = pd.DataFrame(results)
    valid = result[
        result["signal_count"] >= 30
    ].dropna(subset=["avg_30m_pct"])
    if valid.empty:
        best_threshold = 1.8
    else:
        best_threshold = float(
            valid.loc[
                valid["avg_30m_pct"].idxmax(),
                "entry_threshold"
            ]
        )
    return result, best_threshold

def main():
    train = load_data()
    print("Rows:", len(train))
    print("Start:", train["datetime"].iloc[0])
    print("End:", train["datetime"].iloc[-1])
    pattern, best_threshold = find_pattern(train)
    pattern.to_csv(PATTERN_FILE, index=False)
    config = {
        "window_size": WINDOW_SIZE,
        "entry_threshold": best_threshold,
        "exit_threshold": EXIT_THRESHOLD,
        "stop_loss_threshold": STOP_LOSS_THRESHOLD,
        "time_stop_minutes": TIME_STOP_MINUTES
    }
    CONFIG_FILE.write_text(json.dumps(config, indent=2))
    print()
    print(pattern.to_string(index=False))
    print()
    print("Selected ENTRY_THRESHOLD:", best_threshold)
    print("Saved:", PATTERN_FILE)
    print("Saved:", CONFIG_FILE)

if __name__ == "__main__":
    main()