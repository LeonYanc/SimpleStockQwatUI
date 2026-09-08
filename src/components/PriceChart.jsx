import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function PriceChart({ data = [] }) {
  const chartData =
    data.length > 0
      ? data
      : [
          { date: "Feb", price: 211 },
          { date: "Mar", price: 218 },
          { date: "Apr", price: 214 },
          { date: "May", price: 222 },
          { date: "Jun", price: 219 },
          { date: "Jul", price: 225 },
          { date: "Aug", price: 227 },
        ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-medium text-white">Price Performance</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Historical closing price
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
          {["1D", "1W", "1M", "3M", "6M", "1Y"].map((period) => (
            <button
              key={period}
              className={`rounded-md px-3 py-1.5 text-xs ${
                period === "6M"
                  ? "bg-white/10 text-white"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[390px] p-4 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
              domain={["auto", "auto"]}
            />

            <Tooltip
              contentStyle={{
                background: "#111217",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "#111217",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriceChart;