import {
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function StrategyCard({ stock }) {
  const isBuy = stock.signal === "BUY";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-white">Strategy Analysis</h2>
            <p className="mt-1 text-xs text-zinc-600">
              Moving Average Crossover
            </p>
          </div>

          <div
            className={`rounded-lg p-2 ${
              isBuy ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}
          >
            {isBuy ? (
              <ArrowUpRight
                size={19}
                className="text-emerald-400"
              />
            ) : (
              <ArrowDownRight
                size={19}
                className="text-red-400"
              />
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-600">
              Recommendation
            </div>

            <div
              className={`mt-2 text-4xl font-semibold ${
                isBuy ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {stock.signal || "BUY"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-600">Signal strength</div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {Number(stock.confidence || 84).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full ${
              isBuy ? "bg-emerald-400" : "bg-red-400"
            }`}
            style={{
              width: `${Math.min(
                Number(stock.confidence || 84),
                100
              )}%`,
            }}
          />
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">MA20</span>
            <span className="text-zinc-200">
              ${Number(stock.ma20 || 225.32).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">MA50</span>
            <span className="text-zinc-200">
              ${Number(stock.ma50 || 218.76).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 size={14} className="text-emerald-400" />
            MA20 trend confirmation
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Trend momentum detected
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <AlertCircle size={14} className="text-yellow-400" />
            Not financial advice
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategyCard;