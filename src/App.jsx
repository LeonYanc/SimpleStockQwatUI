import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Area,
  AreaChart
} from "recharts";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [symbol, setSymbol] = useState("VOO");
  const [sliceStart, setSliceStart] = useState("2011-01-01T10:00");
  const [sliceEnd, setSliceEnd] = useState("2011-01-01T14:00");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const runTest = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        symbol,
        slice_start: sliceStart,
        slice_end: sliceEnd
      });
      const response = await fetch(`${API}/evaluate?${params}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Evaluation failed.");
      }
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const stats = useMemo(() => {
    if (!result?.slice_data?.length) return null;
    const data = result.slice_data;
    const first = data[0].close;
    const last = data[data.length - 1].close;
    const high = Math.max(...data.map(x => x.high));
    const low = Math.min(...data.map(x => x.low));
    const change = ((last / first) - 1) * 100;
    return { first, last, high, low, change };
  }, [result]);
  const num = value =>
    value === null || value === undefined
      ? "-"
      : Number(value).toFixed(3);
  const pct = value =>
    value === null || value === undefined
      ? "-"
      : `${value >= 0 ? "+" : ""}${Number(value).toFixed(3)}%`;
  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>
      <main className="dashboard">
        <header className="topbar">
          <div>
            <div className="eyebrow">
              HISTORICAL ANALYSIS
            </div>
            <h1>
              Market Data
              <span> Analysis</span>
            </h1>
            <p>
              Discover historical market patterns, generate strategy signals
               and validate them against real market outcomes.
            </p>
          </div>
          <div className="api-status">
            <span className="status-dot"></span>
            API Connected
          </div>
        </header>
        <section className="hero-panel">
          <div className="hero-left">
            <div className="hero-label">
              HISTORICAL EVALUATION
            </div>
            <div className="hero-title">
              Test a market slice
            </div>
            <div className="hero-description">
              Select any historical range. The end of the
              slice becomes the strategy decision point.
            </div>
          </div>
          <div className="controls">
            <Field label="Asset">
              <select
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
              >
                <option value="VOO">VOO</option>
                <option value="QQQ">QQQ</option>
              </select>
            </Field>
            <Field label="Slice Start">
              <input
                type="datetime-local"
                value={sliceStart}
                onChange={e => setSliceStart(e.target.value)}
              />
            </Field>
            <Field label="Slice End">
              <input
                type="datetime-local"
                value={sliceEnd}
                onChange={e => setSliceEnd(e.target.value)}
              />
            </Field>
            <button
              className="run-button"
              onClick={runTest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Running
                </>
              ) : (
                <>
                  Run Analysis
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </section>
        {error && (
          <div className="error-box">
            <div className="error-icon">!</div>
            <div>
              <strong>Evaluation failed</strong>
              <div>{error}</div>
            </div>
          </div>
        )}
        {!result && !loading && (
          <section className="empty-state">
            <div className="empty-icon">
              ↗
            </div>

            <h2>Ready to analyze</h2>

            <p>
              Select a historical time range above and run
              the strategy evaluation.
            </p>
          </section>
        )}
        {result && (
          <>
            <section className="section">
              <SectionTitle
                number="01"
                title="Slice Overview"
                subtitle="Historical sample used by the strategy"
              />
              <div className="metrics-grid">
                <Metric
                  label="Asset"
                  value={symbol}
                  accent
                />
                <Metric
                  label="Start"
                  value={shortDate(result.slice_start)}
                />
                <Metric
                  label="End"
                  value={shortDate(result.slice_end)}
                />
                <Metric
                  label="Bars"
                  value={result.slice_bars}
                />
                <Metric
                  label="Decision Point"
                  value={shortDate(result.decision_time)}
                />
              </div>
            </section>
            {stats && (
              <section className="section chart-section">
                <div className="chart-header">
                  <div>
                    <SectionTitle
                      number="02"
                      title="Price Movement"
                      subtitle="Actual market movement inside the selected slice"
                    />
                  </div>
                  <div className="price-display">
                    <div className="price-label">
                      CURRENT
                    </div>
                    <div className="price-number">
                      ${num(stats.last)}
                    </div>
                    <div
                      className={
                        stats.change >= 0
                          ? "change positive"
                          : "change negative"
                      }
                    >
                      {pct(stats.change)}
                    </div>
                  </div>
                </div>
                <div className="price-stats">
                  <MiniStat
                    label="Open"
                    value={`$${num(stats.first)}`}
                  />
                  <MiniStat
                    label="High"
                    value={`$${num(stats.high)}`}
                  />
                  <MiniStat
                    label="Low"
                    value={`$${num(stats.low)}`}
                  />
                  <MiniStat
                    label="Close"
                    value={`$${num(stats.last)}`}
                  />
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={430}>
                    <AreaChart data={result.slice_data}>
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7c6cff"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="100%"
                            stopColor="#7c6cff"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(255,255,255,.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="time"
                        stroke="#697386"
                        tickLine={false}
                        axisLine={false}
                        minTickGap={70}
                        tickFormatter={value =>
                          value?.slice(5, 16)
                        }
                      />
                      <YAxis
                        stroke="#697386"
                        tickLine={false}
                        axisLine={false}
                        domain={["auto", "auto"]}
                        width={65}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                      />
                      <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#8b7cff"
                        strokeWidth={2.5}
                        fill="url(#chartGradient)"
                        dot={false}
                        isAnimationActive={false}
                      />
                      <Brush
                        dataKey="time"
                        height={28}
                        stroke="#7967ff"
                        fill="#111522"
                        travellerWidth={8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
            <section className="section">
              <SectionTitle
                number="03"
                title="Strategy Signal"
                subtitle="Decision generated at the end of the selected slice"
              />
              <div className="strategy-layout">
                <div
                  className={`signal-card ${
                    result.decision === "BUY"
                      ? "buy"
                      : "hold"
                  }`}
                >
                  <div className="signal-label">
                    STRATEGY DECISION
                  </div>
                  <div className="signal-value">
                    {result.decision}
                  </div>
                  <div className="signal-time">
                    {result.decision_time}
                  </div>
                </div>
                <div className="metrics-grid strategy-metrics">
                  <Metric
                    label="Price"
                    value={`$${num(result.price)}`}
                  />
                  <Metric
                    label="Rolling Mean"
                    value={num(result.mean)}
                  />
                  <Metric
                    label="Std Dev"
                    value={num(result.std)}
                  />
                  <Metric
                    label="Z Score"
                    value={num(result.z_score)}
                    accent
                  />
                  <Metric
                    label="Entry Threshold"
                    value={`-${num(result.entry_threshold)}`}
                  />
                </div>
              </div>
            </section>
            <section className="section">
              <SectionTitle
                number="04"
                title="Actual Market Evaluation"
                subtitle="What actually happened after the strategy decision"
              />
              <div className="evaluation-banner">
                <div>
                  <div className="banner-label">
                    EVALUATION
                  </div>
                  <div
                    className={`evaluation-result ${
                      result.evaluation === "CORRECT"
                        ? "correct"
                        : "wrong"
                    }`}
                  >
                    <span className="evaluation-dot"></span>
                    {result.evaluation}
                  </div>
                </div>
                <div className="banner-divider"></div>
                <div>
                  <div className="banner-label">
                    ACTUAL RETURN
                  </div>
                  <div
                    className={
                      result.actual_return_pct >= 0
                        ? "banner-number positive-text"
                        : "banner-number negative-text"
                    }
                  >
                    {pct(result.actual_return_pct)}
                  </div>
                </div>
                <div>
                  <div className="banner-label">
                    STRATEGY RETURN
                  </div>
                  <div
                    className={
                      result.strategy_return_pct >= 0
                        ? "banner-number positive-text"
                        : "banner-number negative-text"
                    }
                  >
                    {pct(result.strategy_return_pct)}
                  </div>
                </div>
                <div>
                  <div className="banner-label">
                    EXIT REASON
                  </div>

                  <div className="banner-text">
                    {result.exit_reason || "-"}
                  </div>
                </div>
              </div>
              <div className="metrics-grid">
                <Metric
                  label="Entry Time"
                  value={shortDate(result.entry_time)}
                />
                <Metric
                  label="Entry Price"
                  value={
                    result.entry_price
                      ? `$${num(result.entry_price)}`
                      : "-"
                  }
                />
                <Metric
                  label="Exit Time"
                  value={shortDate(result.exit_time)}
                />
                <Metric
                  label="Exit Price"
                  value={
                    result.exit_price
                      ? `$${num(result.exit_price)}`
                      : "-"
                  }
                />
                <Metric
                  label="Highest"
                  value={
                    result.highest_price
                      ? `$${num(result.highest_price)}`
                      : "-"
                  }
                />
                <Metric
                  label="Lowest"
                  value={
                    result.lowest_price
                      ? `$${num(result.lowest_price)}`
                      : "-"
                  }
                />
              </div>
            </section>
            <section className="section">
              <SectionTitle
                number="05"
                title="Forward Returns"
                subtitle="Observed performance following the simulated entry"
              />
              <div className="forward-grid">
                {[5, 15, 30, 60].map(m => {
                  const value =
                    result[`actual_${m}m_return_pct`];
                  return (
                    <div className="forward-card" key={m}>
                      <div className="forward-time">
                        {m}
                        <span>MIN</span>
                      </div>
                      <div
                        className={
                          value >= 0
                            ? "forward-value positive-text"
                            : "forward-value negative-text"
                        }
                      >
                        {pct(value)}
                      </div>
                      <div className="forward-price">
                        $
                        {num(
                          result[
                            `actual_${m}m_price`
                          ]
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Metric({ label, value, accent = false }) {
  return (
    <div className="metric-card">
      <div className="metric-label">
        {label}
      </div>

      <div
        className={`metric-value ${
          accent ? "accent-text" : ""
        }`}
      >
        {value ?? "-"}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="section-title">
      <div className="section-number">
        {number}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label
}) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="custom-tooltip">
      <div>{label}</div>
      <strong>
        ${Number(payload[0].value).toFixed(3)}
      </strong>
    </div>
  );
}

function shortDate(value) {
  if (!value) return "-";
  return String(value)
    .replace("T", " ")
    .slice(0, 16);
}

export default App;