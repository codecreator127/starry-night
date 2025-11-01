'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { addEvent, deleteEvent, getEvents, updateEvent } from '@/lib/events';
import LoginOverlay from './LoginOverlay';
import ExpandableControls from './ButtonAnimation';
import CreateEventOverlay from './CreateEventOverlay';
import RemoveEventOverlay from './RemoveEventOverlay';

interface Star {
  id: string;
  top: number;
  left: number;
  info: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

export default function StarryNight() {
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [animationTick, setAnimationTick] = useState(0);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // <-- New
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateEventOverlay, setShowCreateEventOverlay] = useState(false);
  const [showRemoveEventOverlay, setShowRemoveEventOverlay] = useState(false);

  // --- show login when pressing "P"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p' && !showLogin) {
        setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogin]);

  // --- fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, []);

  const [stars, setStars] = useState<Star[]>([]);

  // --- generate stars from events
  useEffect(() => {
    if (events.length === 0) return;

    const paddingPercent = 10;
    const newStars: Star[] = events.map((event, i) => ({
      id: event.id.toString(),
      left:
        events.length === 1
          ? 50
          : paddingPercent + ((100 - 2 * paddingPercent) * i) / (events.length - 1),
      top: 30 + Math.random() * 40,
      info: `${event.title} - ${event.description.slice(0, 50)}${
        event.description.length > 50 ? '...' : ''
      }`,
    }));

    setStars(newStars);
  }, [events]);

  // --- animation tick
  useEffect(() => {
    const interval = setInterval(() => setAnimationTick((t) => t + 0.01), 16);
    return () => clearInterval(interval);
  }, []);

  // --- zoom and drag
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // --- star click
  const handleStarClick = (star: Star) => {
    const event = events.find((e) => e.id === Number(star.id));
    if (!event) return;

    if (isLoggedIn) {
      // Open editable overlay
      setEditingEvent(event);
      setShowCreateEventOverlay(true);
    } else {
      // Zoom and show read-only event
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

      setTimeout(() => setActiveEvent(event), 2000);
    }
  };

  const closeEvent = () => {
    setActiveEvent(null);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // --- close on ESC
  useEffect(() => {
    if (!activeEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEvent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEvent]);

  // --- create or edit event handler
  const handleSaveEvent = async (data: {
    id?: number;
    title: string;
    description: string;
    imageFile?: File;
    videoFile?: File;
  }) => {
    if (data.id) {
      // Editing existing event

      updateEvent(data.id, {
        title: data.title,
        description: data.description,
        imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : undefined,
        videoUrl: data.videoFile ? URL.createObjectURL(data.videoFile) : undefined,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === data.id
            ? {
                ...e,
                title: data.title,
                description: data.description,
                imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : e.imageUrl,
                videoUrl: data.videoFile ? URL.createObjectURL(data.videoFile) : e.videoUrl,
              }
            : e
        )
      );
    } else {
      // New event
      try {
        const newEvent = await addEvent({
          title: data.title,
          description: data.description,
          imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : null,
          videoUrl: data.videoFile ? URL.createObjectURL(data.videoFile) : null,
        });
        setEvents((prev) => [...prev, newEvent]);
      } catch (err) {
        console.error('Failed to add event:', err);
      }
    }
  };

  const handleRemoveEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to remove event:', err);
    }
  };

  const [backgroundStars] = useState(() =>
    [...Array(150)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }))
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {backgroundStars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: star.size,
              height: star.size,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Moving stars + lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{ transformOrigin: 'top left' }}
        animate={{ scale, x: offset.x, y: offset.y }}
        transition={{ duration: 2.3, ease: 'easeInOut' }}
      >
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
      </motion.div>

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

      {/* Read-only Active Event Overlay */}
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

      {/* Login */}
      <AnimatePresence>
        {showLogin && (
          <LoginOverlay
            onClose={() => setShowLogin(false)}
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              setShowLogin(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Create / Edit Event Overlay */}
      {showCreateEventOverlay && (
        <CreateEventOverlay
          initialEvent={editingEvent || undefined}
          onClose={() => {
            setShowCreateEventOverlay(false);
            setEditingEvent(null);
          }}
          onSave={(data) => {
            handleSaveEvent(data);
            setShowCreateEventOverlay(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Remove Event */}
      {showRemoveEventOverlay && (
        <RemoveEventOverlay
          events={events}
          onClose={() => setShowRemoveEventOverlay(false)}
          onRemove={(id) => handleRemoveEvent(id)}
        />
      )}

      {/* Controls */}
      {isLoggedIn &&
        !showLogin &&
        !showCreateEventOverlay &&
        !showRemoveEventOverlay &&
        !activeEvent && (
          <ExpandableControls
            onCreateClick={() => {
              setEditingEvent(null); // new event
              setShowCreateEventOverlay(true);
            }}
            onRemoveClick={() => setShowRemoveEventOverlay(true)}
          />
        )}
    </div>
  );
}
