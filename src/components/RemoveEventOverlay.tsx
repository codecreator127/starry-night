'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  description: string;
}

interface RemoveEventOverlayProps {
  events: Event[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

export default function RemoveEventOverlay({ events, onClose, onRemove }: RemoveEventOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-transparent border border-white rounded p-6 text-white w-80 flex flex-col gap-3"
      >
        <h2 className="text-xl font-bold mb-2 text-center">Remove Events</h2>
        {events.length === 0 ? (
          <p className="text-center text-gray-400">No events to remove</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center border-b border-gray-500 pb-1"
              >
                <span className="truncate">{event.title}</span>
                <button
                  onClick={() => onRemove(event.id)}
                  className="text-red-400 hover:text-red-200 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-center text-gray-300 hover:text-white transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
