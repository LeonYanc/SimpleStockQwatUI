import { useState } from "react";
import { runBacktest } from "../api/stockApi";
import PriceChart from "../components/PriceChart";

function Dashboard() {
  const [decisionTime, setDecisionTime] =
    useState("2013-04-15T10:30");

  const [sliceMinutes, setSliceMinutes] =
    useState(60);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRun = async () => {
    try {
      setLoading(true);
      setError("");

      const time =
        decisionTime.replace("T", " ") +
        ":00";

      const response =
        await runBacktest(
          time,
          sliceMinutes
        );

      setResult(response.data);
    }

    catch (err) {
      setResult(null);

      setError(
        err.response?.data?.detail ||
        err.message
      );
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-2 text-4xl font-bold">
          📈 VOO Strategy Backtest
        </h1>

        <p className="mb-8 text-slate-400">
          Historical Z-Score Mean Reversion Strategy
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <h2 className="mb-5 text-xl font-semibold">
            Historical Test
          </h2>

          <div className="flex flex-wrap gap-5">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Decision Time
              </label>

              <input
                type="datetime-local"
                value={decisionTime}
                onChange={(e) =>
                  setDecisionTime(
                    e.target.value
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Historical Slice
              </label>

              <input
                type="number"
                value={sliceMinutes}
                onChange={(e) =>
                  setSliceMinutes(
                    e.target.value
                  )
                }
                className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white"
              />

              <span className="ml-2 text-sm text-slate-500">
                minutes
              </span>
            </div>

          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Running..."
              : "Run Strategy Test"}
          </button>

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

        </div>

        {result && (
          <>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

                <p className="text-sm text-slate-500">
                  Decision
                </p>

                <p
                  className={`mt-3 text-4xl font-bold ${
                    result.decision === "BUY"
                      ? "text-emerald-400"
                      : "text-yellow-400"
                  }`}
                >
                  {result.decision}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

                <p className="text-sm text-slate-500">
                  Z-Score
                </p>

                <p className="mt-3 text-4xl font-bold">
                  {Number(
                    result.z_score
                  ).toFixed(3)}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Entry threshold:
                  {" "}
                  {result.entry_threshold}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

                <p className="text-sm text-slate-500">
                  Evaluation
                </p>

                <p
                  className={`mt-3 text-4xl font-bold ${
                    result.evaluation ===
                    "CORRECT"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {result.evaluation || "N/A"}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <h2 className="mb-5 text-xl font-semibold">
                Strategy Result
              </h2>

              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

                <Result
                  name="Signal Price"
                  value={
                    result.price != null
                      ? `$${Number(
                          result.price
                        ).toFixed(2)}`
                      : "-"
                  }
                />

                <Result
                  name="Mean"
                  value={
                    result.mean != null
                      ? `$${Number(
                          result.mean
                        ).toFixed(2)}`
                      : "-"
                  }
                />

                <Result
                  name="Std"
                  value={
                    result.std != null
                      ? Number(
                          result.std
                        ).toFixed(4)
                      : "-"
                  }
                />

                <Result
                  name="Entry Price"
                  value={
                    result.entry_price != null
                      ? `$${Number(
                          result.entry_price
                        ).toFixed(2)}`
                      : "-"
                  }
                />

              </div>

            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <h2 className="mb-5 text-xl font-semibold">
                Actual Market Result
              </h2>

              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

                <ReturnCard
                  name="5 Minutes"
                  value={
                    result.actual_5m_return_pct
                  }
                />

                <ReturnCard
                  name="15 Minutes"
                  value={
                    result.actual_15m_return_pct
                  }
                />

                <ReturnCard
                  name="30 Minutes"
                  value={
                    result.actual_30m_return_pct
                  }
                />

                <ReturnCard
                  name="60 Minutes"
                  value={
                    result.actual_60m_return_pct
                  }
                />

              </div>

            </div>

            {result.decision === "BUY" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

                <h2 className="mb-5 text-xl font-semibold">
                  Strategy Exit
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  <Result
                    name="Exit Reason"
                    value={
                      result.exit_reason ||
                      "-"
                    }
                  />

                  <Result
                    name="Exit Price"
                    value={
                      result.exit_price != null
                        ? `$${Number(
                            result.exit_price
                          ).toFixed(2)}`
                        : "-"
                    }
                  />

                  <ReturnCard
                    name="Strategy Return"
                    value={
                      result.strategy_return_pct
                    }
                  />

                </div>

              </div>
            )}

            <div className="mt-6">
              <PriceChart
                data={result.history || []}
              />
            </div>

          </>
        )}

      </div>

    </div>
  );
}

function Result({ name, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {name}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function ReturnCard({ name, value }) {
  const number =
    value == null
      ? null
      : Number(value);

  return (
    <div>
      <p className="text-sm text-slate-500">
        {name}
      </p>

      <p
        className={`mt-2 text-xl font-semibold ${
          number == null
            ? "text-white"
            : number > 0
            ? "text-emerald-400"
            : number < 0
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {number == null
          ? "-"
          : `${number >= 0 ? "+" : ""}${number.toFixed(3)}%`}
      </p>
    </div>
  );
}

export default Dashboard;