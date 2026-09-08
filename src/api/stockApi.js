import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export async function runBacktest(
  decisionTime,
  sliceMinutes
) {
  return API.post("/backtest", {
    decision_time: decisionTime,
    slice_minutes: Number(sliceMinutes),
  });
}