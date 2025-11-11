'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

interface EventDisplayProps {
  event: Event;
  onClose: () => void;
}

export default function EventDisplay({ event, onClose }: EventDisplayProps) {
  const { title, description, imageUrl, videoUrl } = event;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative flex flex-col items-center w-full max-w-4xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
        >
          <X size={24} />
        </button>

        {/* Text Section */}
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-white drop-shadow-md">{description}</p>
        </div>

        {/* Media Section */}
        {(imageUrl || videoUrl) && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            {imageUrl && (
              <div className="flex-1 w-full md:w-1/2 h-64 lg:h-80 flex items-center justify-center bg-black rounded-lg">
                <img
                  src={imageUrl}
                  alt={title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            {videoUrl && (
              <div className="flex-1 w-full md:w-1/2 h-64 lg:h-80 flex items-center justify-center bg-black rounded-lg">
                <video
                  src={videoUrl}
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
