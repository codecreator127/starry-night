'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Star {
  id: string;
  top: number;
  left: number;
  info: string;
}

// Mock events
interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Event 1',
    description: 'Description of event 1',
    imageUrl: null,
    videoUrl: null,
  },
  {
    id: 2,
    title: 'Event 2',
    description: 'Description of event 2',
    imageUrl: null,
    videoUrl: null,
  },
  {
    id: 3,
    title: 'Event 3',
    description: 'Description of event 3',
    imageUrl: null,
    videoUrl: null,
  },
];

const generateStars = (count: number) => {
  const stars: Star[] = [];
  const paddingPercent = 10;
  for (let i = 0; i < count; i++) {
    stars.push({
      id: (i + 1).toString(),
      left: paddingPercent + ((100 - 2 * paddingPercent) * i) / (count - 1),
      top: 30 + Math.random() * 40,
      info: `Star ${i + 1}: Click to view event`,
    });
  }
  return stars;
};

const stars = generateStars(events.length);

export default function StarryNight() {
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [animationTick, setAnimationTick] = useState(0);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate stars
  useEffect(() => {
    const interval = setInterval(() => setAnimationTick((t) => t + 0.01), 16);
    return () => clearInterval(interval);
  }, []);

  // Zoom with wheel
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    setScale((prev) => Math.min(Math.max(prev + delta * 0.001, 0.5), 3));
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Click star → zoom in and show event
  const handleStarClick = (star: Star) => {
    const zoomTargetScale = 4;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const starX = (star.left / 100) * window.innerWidth;
    const starY = (star.top / 100) * window.innerHeight;

    const newOffset = {
      x: centerX - starX * zoomTargetScale,
      y: centerY - starY * zoomTargetScale,
    };

    setHoveredStar(null);
    setIsDragging(false);

    setOffset(newOffset);
    setScale(zoomTargetScale);

    // Show event info after zoom animation
    setTimeout(() => {
      const event = events.find((e) => e.id === Number(star.id));
      setActiveEvent(event || null);
    }, 2000);
  };

  // Close event info
  const closeEvent = () => {
    setActiveEvent(null);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Close event overlay on Escape key
  useEffect(() => {
    if (!activeEvent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeEvent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEvent]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{ transformOrigin: 'top left' }}
        animate={{ scale, x: offset.x, y: offset.y }}
        transition={{ duration: 2.3, ease: 'easeInOut' }}
      >
        {/* Lines */}
        <svg className="absolute w-full h-full top-0 left-0">
          {stars.map((star, index) => {
            if (index === stars.length - 1) return null;
            const nextStar = stars[index + 1];
            const y1 = star.top + Math.sin(animationTick + Number(star.id)) * 2;
            const y2 = nextStar.top + Math.sin(animationTick + Number(nextStar.id)) * 2;
            return (
              <line
                key={star.id}
                x1={`${star.left}%`}
                y1={`${y1}%`}
                x2={`${nextStar.left}%`}
                y2={`${y2}%`}
                stroke="white"
                strokeWidth={1.5}
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Stars */}
        {stars.map((star) => {
          const y = star.top + Math.sin(animationTick + Number(star.id)) * 2;
          return (
            <div
              key={star.id}
              className="absolute w-8 h-8 bg-white rounded-full cursor-pointer hover:scale-150 transition-transform"
              style={{ top: `${y}%`, left: `${star.left}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleStarClick(star)}
            />
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredStar && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0 }}
              className="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md pointer-events-none z-50"
              style={{
                top: `${hoveredStar.top - 5}%`,
                left: `${hoveredStar.left}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {hoveredStar.info}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Event Info Overlay */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 text-white p-6 z-50"
          >
            <h2 className="text-3xl font-bold mb-4">{activeEvent.title}</h2>
            <p className="mb-4 text-center max-w-xl">{activeEvent.description}</p>

            {activeEvent.imageUrl && (
              <div className="max-w-sm mb-4 relative w-full h-64">
                <Image
                  src={activeEvent.imageUrl}
                  alt={activeEvent.title}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            {activeEvent.videoUrl && (
              <video src={activeEvent.videoUrl} controls className="max-w-sm rounded mb-4" />
            )}
            <button
              onClick={closeEvent}
              className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
