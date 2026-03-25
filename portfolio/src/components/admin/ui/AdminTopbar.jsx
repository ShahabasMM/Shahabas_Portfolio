import React, { useState } from 'react';
import { Menu, Search, UserCircle2, LogOut, ChevronDown } from 'lucide-react';

const AdminTopbar = ({ title, query, setQuery, onOpenMobileSidebar, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111]/75 backdrop-blur-xl">
      <div className="h-16 px-4 md:px-6 xl:px-8 flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden w-10 h-10 rounded-xl border border-white/12 hover:border-primary/45 transition-colors flex items-center justify-center"
        >
          <Menu size={18} />
        </button>

        <h1 className="text-xl font-bold">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 w-56 lg:w-72 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/12 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(254,31,25,0.15)] text-sm transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((s) => !s)}
              className="h-10 px-3 rounded-xl border border-white/12 hover:border-primary/45 transition-colors flex items-center gap-2"
            >
              <UserCircle2 size={18} />
              <span className="hidden md:inline text-sm">Admin</span>
              <ChevronDown size={14} />
            </button>
            {open ? (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1b1b1b] border border-white/12 shadow-[0_16px_36px_rgba(0,0,0,0.35)] p-1">
                <button
                  onClick={onLogout}
                  className="w-full h-10 rounded-lg px-3 text-left hover:bg-white/[0.05] flex items-center gap-2"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

