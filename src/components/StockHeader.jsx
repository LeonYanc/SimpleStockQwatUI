import { TrendingUp, TrendingDown, Star } from "lucide-react";

function StockHeader({ stock }) {
  const positive = stock.change >= 0;

  return (
    <section className="mb-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="text-sm font-medium text-zinc-500">
              US EQUITY
            </div>

            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
              NASDAQ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {stock.symbol}
            </h1>

            <button className="rounded-lg border border-white/10 p-2 text-zinc-600 hover:text-yellow-400">
              <Star size={17} />
            </button>
          </div>

          <p className="mt-1 text-sm text-zinc-500">{stock.name}</p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-4xl font-semibold tracking-tight text-white">
            ${Number(stock.price).toFixed(2)}
          </div>

          <div
            className={`mt-1 flex items-center gap-1 text-sm md:justify-end ${
              positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {positive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}

            <span>
              {positive ? "+" : ""}
              {Number(stock.change).toFixed(2)}%
            </span>

            <span className="text-zinc-600">today</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StockHeader;