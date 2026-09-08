import { ExternalLink } from "lucide-react";

function NewsPanel() {
  const news = [
    {
      source: "Market Watch",
      title: "US stocks extend gains as technology shares lead market",
      time: "18 min ago",
    },
    {
      source: "Reuters",
      title: "Investors focus on earnings and upcoming economic data",
      time: "42 min ago",
    },
    {
      source: "Bloomberg",
      title: "Technology sector remains in focus ahead of major earnings",
      time: "1 hr ago",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <h2 className="font-medium text-white">Market News</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Latest market headlines
          </p>
        </div>

        <ExternalLink size={16} className="text-zinc-600" />
      </div>

      <div className="divide-y divide-white/5">
        {news.map((item) => (
          <article key={item.title} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400">
                {item.source}
              </span>

              <span className="text-[10px] text-zinc-700">
                {item.time}
              </span>
            </div>

            <h3 className="mt-2 text-sm leading-6 text-zinc-300">
              {item.title}
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
}

export default NewsPanel;