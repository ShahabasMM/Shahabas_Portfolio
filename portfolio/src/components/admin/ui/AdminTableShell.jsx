import React from 'react';
import AdminCard from './AdminCard';

const AdminTableShell = ({ title, action, children }) => (
  <AdminCard className="p-4 md:p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      {action}
    </div>
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
      {children}
    </div>
  </AdminCard>
);

export default AdminTableShell;

