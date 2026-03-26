import React from 'react';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import AdminCard from './AdminCard';

const SidebarGroup = ({ title, items, activeTab, onSelect, collapsed, unread }) => (
  <div className="mb-4">
    <p className={`text-[11px] uppercase tracking-[0.22em] text-gray-500 px-2 mb-2 ${collapsed ? 'md:hidden' : ''}`}>
      {title}
    </p>
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full h-11 rounded-xl border px-3 flex items-center gap-3 transition-all ${
              active
                ? 'bg-primary/20 border-primary/50 shadow-[0_0_22px_rgba(254,31,25,0.22)]'
                : 'bg-white/[0.02] border-transparent hover:border-white/12 hover:bg-white/[0.05]'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={16} />
            <span className={`text-sm ${collapsed ? 'md:hidden' : ''}`}>{item.label}</span>
            {item.id === 'contacts' && unread > 0 && !collapsed ? (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-primary/40 bg-primary/15 text-primary">
                {unread}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  </div>
);

const SidebarInner = ({
  managementItems,
  settingsItems,
  activeTab,
  onSelect,
  collapsed,
  setCollapsed,
  unread,
  onCloseMobile,
  mobile = false,
}) => (
  <AdminCard className="h-full p-3">
    <div className="flex items-center justify-between px-2 mb-3">
      <div className={`${collapsed ? 'md:hidden' : ''}`}>
        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Portfolio</p>
        <h2 className="text-lg font-bold">Admin</h2>
      </div>
      <div className="flex items-center gap-2">
        {!mobile ? (
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden md:flex w-8 h-8 rounded-lg border border-white/12 hover:border-primary/50 items-center justify-center"
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
        ) : null}
        {mobile ? (
          <button
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-lg border border-white/12 hover:border-primary/50 flex items-center justify-center"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>
    </div>

    <SidebarGroup
      title="Management"
      items={managementItems}
      activeTab={activeTab}
      onSelect={onSelect}
      collapsed={collapsed}
      unread={unread}
    />
    <SidebarGroup
      title="Settings"
      items={settingsItems}
      activeTab={activeTab}
      onSelect={onSelect}
      collapsed={collapsed}
      unread={unread}
    />
  </AdminCard>
);

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  managementItems,
  settingsItems,
  unread,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const widthClass = collapsed ? 'md:w-[88px]' : 'md:w-[270px]';
  const onSelect = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      <aside className={`hidden md:block fixed left-0 top-0 h-screen ${widthClass} p-3 z-40 transition-all`}>
        <SidebarInner
          managementItems={managementItems}
          settingsItems={settingsItems}
          activeTab={activeTab}
          onSelect={onSelect}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          unread={unread}
        />
      </aside>

      {mobileOpen ? (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            className="fixed left-0 top-0 h-screen w-[270px] p-3 z-50 md:hidden"
            initial={{ x: -290 }}
            animate={{ x: 0 }}
            exit={{ x: -290 }}
          >
            <SidebarInner
              managementItems={managementItems}
              settingsItems={settingsItems}
              activeTab={activeTab}
              onSelect={onSelect}
              collapsed={false}
              setCollapsed={setCollapsed}
              unread={unread}
              onCloseMobile={() => setMobileOpen(false)}
              mobile
            />
          </motion.aside>
        </>
      ) : null}
    </>
  );
};

export default AdminSidebar;

