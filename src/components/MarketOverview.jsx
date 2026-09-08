import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function MarketOverview() {
  const markets = [
    {
      name: "S&P 500",
      value: "6,421.39",
      change: "+0.82%",
    },
    {
      name: "NASDAQ",
      value: "21,450.23",
      change: "+1.14%",
    },
    {
      name: "Dow Jones",
      value: "44,987.12",
      change: "+0.31%",
    },
    {
      name: "VIX",
      value: "16.82",
      change: "-3.42%",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-5 py-5">
        <h2 className="font-medium text-white">Market Overview</h2>
        <p className="mt-1 text-xs text-zinc-600">
          Major US market indices
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-white/5 md:grid-cols-4 md:divide-y-0">
        {markets.map((market) => {
          const positive = market.change.startsWith("+");

          return (
            <div key={market.name} className="p-5">
              <div className="text-xs text-zinc-600">{market.name}</div>

              <div className="mt-2 text-lg font-medium text-white">
                {market.value}
              </div>

              <div
                className={`mt-1 flex items-center gap-1 text-xs ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}

                {market.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MarketOverview;