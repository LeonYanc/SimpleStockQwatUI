import { Search, Bell, Command, Menu } from "lucide-react";

function TopBar({ symbol, setSymbol, onSearch }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0b0f]/90 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-5 lg:px-8">
        <button className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 lg:hidden">
          <Menu size={21} />
        </button>

        <div className="relative max-w-xl flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks, ETFs..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:bg-white/[0.06]"
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] text-zinc-600">
            <Command size={10} />
            K
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Market Open
        </div>

        <button className="rounded-xl border border-white/10 p-2.5 text-zinc-500 hover:bg-white/5 hover:text-white">
          <Bell size={18} />
        </button>

        <button
          onClick={onSearch}
          className="hidden rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 sm:block"
        >
          Analyze
        </button>
      </div>
    </header>
  );
}

export default TopBar;