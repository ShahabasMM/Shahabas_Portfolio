import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import AdminCard from './AdminCard';

const AdminModal = ({ open, title, onClose, children }) => {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 bg-black/65 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <AdminCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg border border-white/15 hover:border-primary/60 transition-colors flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              {children}
            </AdminCard>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default AdminModal;

