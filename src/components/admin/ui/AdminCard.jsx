import React from 'react';

const AdminCard = ({ className = '', children }) => {
  return (
    <section
      className={`rounded-2xl bg-[#1a1a1a]/88 border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-md ${className}`}
    >
      {children}
    </section>
  );
};

export default AdminCard;

