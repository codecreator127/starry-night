'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ExpandableControlsProps {
  onPlusClick?: () => void;
}

export default function ExpandableControls({ onPlusClick }: ExpandableControlsProps) {
  const [isHovered, setIsHovered] = useState(false);

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
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center cursor-pointer"
          onClick={onPlusClick}
        >
          +
        </motion.button>

        {/* - Button stays */}
        <motion.button
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center cursor-pointer"
        >
          -
        </motion.button>
      </div>
    </div>
  );
}
