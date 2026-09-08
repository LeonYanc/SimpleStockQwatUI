import { Activity, BarChart2, Gauge, TrendingUp } from "lucide-react";

function IndicatorCard({ stock }) {
  const indicators = [
    {
      label: "RSI",
      value: "58.2",
      subtext: "Neutral",
      icon: Gauge,
    },
    {
      label: "MA20",
      value: `$${Number(stock.ma20 || 225.32).toFixed(2)}`,
      subtext: "20-day average",
      icon: TrendingUp,
    },
    {
      label: "MA50",
      value: `$${Number(stock.ma50 || 218.76).toFixed(2)}`,
      subtext: "50-day average",
      icon: Activity,
    },
    {
      label: "Volume",
      value: "48.2M",
      subtext: "+12.4% vs avg",
      icon: BarChart2,
    },
  ];

  return (
    <>
      {indicators.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                {item.label}
              </span>

              <Icon size={16} className="text-zinc-600" />
            </div>

            <div className="mt-3 text-2xl font-semibold text-white">
              {item.value}
            </div>

            <div className="mt-2 text-xs text-zinc-600">
              {item.subtext}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default IndicatorCard;