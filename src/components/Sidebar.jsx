import {
  LayoutDashboard,
  BarChart3,
  Star,
  ScanSearch,
  BrainCircuit,
  Settings,
  Wallet,
} from "lucide-react";

function Sidebar() {
  const menu = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      active: true,
    },
    {
      icon: BarChart3,
      label: "Markets",
    },
    {
      icon: Star,
      label: "Watchlist",
    },
    {
      icon: ScanSearch,
      label: "Screener",
    },
    {
      icon: BrainCircuit,
      label: "Strategy",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-[#0a0b0f] lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500">
            <BarChart3 size={20} />
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight">
              StockLens
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Market Intelligence
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
          Workspace
        </div>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  item.active
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-5">
        <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
          Account
        </div>

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
          <Wallet size={18} />
          Portfolio
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
          <Settings size={18} />
          Settings
        </button>

        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium">
              S
            </div>

            <div>
              <div className="text-sm text-zinc-200">Stock Analyst</div>
              <div className="text-xs text-zinc-600">Free workspace</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;