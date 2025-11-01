'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ExpandableControlsProps {
  onCreateClick?: () => void;
  onRemoveClick?: () => void;
  disabled?: boolean;
}

export default function ExpandableControls({
  onCreateClick,
  onRemoveClick,
  disabled,
}: ExpandableControlsProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (disabled) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-12 h-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {/* + Button */}
        <motion.button
          animate={{ y: isHovered ? -50 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onCreateClick}
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center cursor-pointer shadow-lg"
        >
          +
        </motion.button>

        {/* - Button */}
        <motion.button
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onRemoveClick}
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center cursor-pointer shadow-lg"
        >
          –
        </motion.button>
      </div>
    </div>
  );
}
