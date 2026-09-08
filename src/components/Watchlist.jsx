import { Star } from "lucide-react";

function Watchlist({ onSelect }) {
  const stocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 227.16,
      change: 1.24,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 181.47,
      change: 2.81,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 331.62,
      change: -0.74,
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      price: 522.19,
      change: 0.61,
    },
    {
      symbol: "AMZN",
      name: "Amazon",
      price: 219.32,
      change: -1.12,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <h2 className="font-medium text-white">Watchlist</h2>
          <p className="mt-1 text-xs text-zinc-600">Your tracked stocks</p>
        </div>

        <Star size={17} className="text-yellow-400" />
      </div>

      <div className="divide-y divide-white/5">
        {stocks.map((stock) => {
          const positive = stock.change >= 0;

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.04]"
            >
              <div>
                <div className="font-medium text-white">{stock.symbol}</div>
                <div className="mt-1 text-xs text-zinc-600">{stock.name}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-zinc-200">
                  ${stock.price.toFixed(2)}
                </div>

                <div
                  className={`mt-1 text-xs ${
                    positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {positive ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full border-t border-white/10 px-5 py-4 text-center text-xs text-zinc-500 transition hover:text-white">
        View all stocks →
      </button>
    </div>
  );
}

export default Watchlist;