function MetricCard({ label, value, subtext, positive }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 hover:bg-white/[0.04]">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </div>

      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>

      {subtext && (
        <div
          className={`mt-2 text-xs ${
            positive === true
              ? "text-emerald-400"
              : positive === false
              ? "text-red-400"
              : "text-zinc-500"
          }`}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}

export default MetricCard;