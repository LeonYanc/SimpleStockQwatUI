import sys
import json
from pathlib import Path
from datetime import datetime
import numpy as np
import pandas as pd
from strategy import clean_data

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "historical_data"
CONFIG_FILE = DATA_DIR / "strategy_config.json"
RESULT_FILE = DATA_DIR / "point_test_result.csv"

SYMBOL = "VOO"
DECISION_TIME = "2012-04-16 10:30:00"
SLICE_MINUTES = 60
FUTURE_MINUTES = [5, 15, 30, 60]

def load_config():
    if not CONFIG_FILE.exists():
        raise FileNotFoundError("strategy_config.json not found. Run strategy.py first.")
    return json.loads(CONFIG_FILE.read_text())

def load_data(symbol="VOO"):
    files = sorted(DATA_DIR.glob(f"{symbol}_*.csv"))

    if not files:
        raise FileNotFoundError(f"No {symbol} data found.")

    frames = []

    for file in files:
        print("Loading:", file.name)
        frames.append(pd.read_csv(file))

    return clean_data(
        pd.concat(frames, ignore_index=True)
    )

def calculate_z_score(prices, window_size):
    prices = pd.Series(prices).tail(window_size)
    if len(prices) < window_size:
        return np.nan, np.nan, np.nan
    mean = prices.mean()
    std = prices.std(ddof=0)
    z_score = 0 if std == 0 else (prices.iloc[-1] - mean) / std
    return float(z_score), float(mean), float(std)

def simulate_actual_trade(df, decision_index, window_size, exit_threshold, stop_loss_threshold, time_stop_minutes):
    entry_index = decision_index + 1
    if entry_index >= len(df):
        return None
    entry_row = df.iloc[entry_index]
    entry_time = entry_row["datetime"]
    entry_price = float(entry_row["open"])
    end_index = min(entry_index + time_stop_minutes, len(df))
    future = df.iloc[entry_index:end_index]
    exit_time = None
    exit_price = None
    exit_reason = None
    for i in range(entry_index, end_index):
        row = df.iloc[i]
        start = max(0, i - window_size + 1)
        prices = df.iloc[start:i + 1]["close"]
        z_score, _, _ = calculate_z_score(prices, window_size)

        if np.isnan(z_score):
            continue
        if z_score <= -stop_loss_threshold:
            exit_time = row["datetime"]
            exit_price = float(row["close"])
            exit_reason = "Z_SCORE_STOP_LOSS"
            break
        if z_score >= -exit_threshold:
            exit_time = row["datetime"]
            exit_price = float(row["close"])
            exit_reason = "MEAN_REVERSION"
            break
        if i == end_index - 1:
            exit_time = row["datetime"]
            exit_price = float(row["close"])
            exit_reason = "TIME_STOP" if len(future) >= time_stop_minutes else "NO_EXIT"
    if exit_price is None:
        last_row = future.iloc[-1]
        exit_time = last_row["datetime"]
        exit_price = float(last_row["close"])
        exit_reason = "NO_EXIT"
    actual_return_pct = ((exit_price / entry_price) - 1) * 100
    highest_price = float(future["high"].max())
    lowest_price = float(future["low"].min())
    best_return_pct = ((highest_price / entry_price) - 1) * 100
    worst_return_pct = ((lowest_price / entry_price) - 1) * 100
    return {
        "entry_time": entry_time,
        "entry_price": entry_price,
        "exit_time": exit_time,
        "exit_price": exit_price,
        "exit_reason": exit_reason,
        "actual_return_pct": actual_return_pct,
        "highest_price": highest_price,
        "lowest_price": lowest_price,
        "best_return_pct": best_return_pct,
        "worst_return_pct": worst_return_pct
    }

def get_future_returns(df, decision_index, entry_price):
    result = {}
    entry_index = decision_index + 1
    for minutes in FUTURE_MINUTES:
        target_index = entry_index + minutes - 1
        if target_index >= len(df):
            result[f"actual_{minutes}m_price"] = None
            result[f"actual_{minutes}m_return_pct"] = None
            continue
        price = float(df.iloc[target_index]["close"])
        result[f"actual_{minutes}m_price"] = price
        result[f"actual_{minutes}m_return_pct"] = ((price / entry_price) - 1) * 100
    return result

def run_test(slice_start, slice_end, symbol="VOO"):
    config = load_config()
    df = load_data(symbol)

    window_size = int(config["window_size"])
    entry_threshold = float(config["entry_threshold"])
    exit_threshold = float(config["exit_threshold"])
    stop_loss_threshold = float(config["stop_loss_threshold"])
    time_stop_minutes = int(config["time_stop_minutes"])

    slice_start = pd.Timestamp(slice_start)
    slice_end = pd.Timestamp(slice_end)

    if slice_start >= slice_end:
        raise ValueError("Slice start must be before slice end.")

    history = df[
        (df["datetime"] >= slice_start) &
        (df["datetime"] <= slice_end)
    ].copy()

    if len(history) < window_size:
        raise ValueError(
            f"Selected slice contains {len(history)} bars. "
            f"Need at least {window_size}."
        )

    decision_index = int(history.index[-1])
    decision_time = history.iloc[-1]["datetime"]

    z_score, mean, std = calculate_z_score(
        history["close"],
        window_size
    )

    price = float(history.iloc[-1]["close"])
    decision = "BUY" if z_score < -entry_threshold else "DO_NOT_BUY"

    slice_data = []
    for _, row in history.iterrows():
        slice_data.append({
            "time": str(row["datetime"]),
            "open": float(row["open"]),
            "high": float(row["high"]),
            "low": float(row["low"]),
            "close": float(row["close"])
        })

    result = {
        "requested_slice_start": str(slice_start),
        "requested_slice_end": str(slice_end),
        "slice_start": str(history.iloc[0]["datetime"]),
        "slice_end": str(history.iloc[-1]["datetime"]),
        "slice_bars": len(history),
        "decision_time": str(decision_time),
        "price": price,
        "mean": mean,
        "std": std,
        "z_score": z_score,
        "entry_threshold": entry_threshold,
        "decision": decision,
        "slice_data": slice_data
    }

    actual = simulate_actual_trade(
        df,
        decision_index,
        window_size,
        exit_threshold,
        stop_loss_threshold,
        time_stop_minutes
    )

    if actual is None:
        result["evaluation"] = "NO_DATA"
        return result

    for key, value in actual.items():
        if isinstance(value, pd.Timestamp):
            actual[key] = str(value)

    result.update(actual)
    result.update(
        get_future_returns(
            df,
            decision_index,
            actual["entry_price"]
        )
    )

    profitable = actual["actual_return_pct"] > 0

    if decision == "BUY":
        result["evaluation"] = "CORRECT" if profitable else "WRONG"
        result["strategy_return_pct"] = actual["actual_return_pct"]
    else:
        result["evaluation"] = "WRONG" if profitable else "CORRECT"
        result["strategy_return_pct"] = 0.0

    result["actual_profitable"] = profitable

    return result

def main():
    decision_time = sys.argv[1] if len(sys.argv) >= 2 else DECISION_TIME
    slice_minutes = int(sys.argv[2]) if len(sys.argv) >= 3 else SLICE_MINUTES
    result = run_test(decision_time, slice_minutes)
    print()
    for key, value in result.items():
        print(f"{key}: {value}")
    output = result.copy()
    for key, value in output.items():
        if isinstance(value, (pd.Timestamp, datetime)):
            output[key] = str(value)
    pd.DataFrame([output]).to_csv(RESULT_FILE, index=False)
    print("\nSaved:", RESULT_FILE)

if __name__ == "__main__":
    main()