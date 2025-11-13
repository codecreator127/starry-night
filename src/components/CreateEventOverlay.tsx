'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Event } from '@/lib/events';

interface CreateEventOverlayProps {
  onClose: () => void;
  onSave?: (event: {
    id?: number;
    title: string;
    description: string;
    imageFile?: File;
    videoFile?: File;
    imageRemoved?: boolean; // track removal
    videoRemoved?: boolean;
  }) => void;
  initialEvent?: Event;
}

export default function CreateEventOverlay({
  onClose,
  onSave,
  initialEvent,
}: CreateEventOverlayProps) {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialEvent?.imageUrl || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(initialEvent?.videoUrl || null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [videoRemoved, setVideoRemoved] = useState(false);

  // Update previews when files change
  useEffect(() => {
    let imageObjectUrl: string | undefined;
    let videoObjectUrl: string | undefined;

    if (imageFile) {
      imageObjectUrl = URL.createObjectURL(imageFile);
      setImagePreview(imageObjectUrl);
      setImageRemoved(false);
    } else if (!imageRemoved) {
      setImagePreview(initialEvent?.imageUrl || null);
    } else {
      setImagePreview(null);
    }

    if (videoFile) {
      videoObjectUrl = URL.createObjectURL(videoFile);
      setVideoPreview(videoObjectUrl);
      setVideoRemoved(false);
    } else if (!videoRemoved) {
      setVideoPreview(initialEvent?.videoUrl || null);
    } else {
      setVideoPreview(null);
    }

    return () => {
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    };
  }, [imageFile, videoFile, imageRemoved, videoRemoved, initialEvent]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (title && description) {
      onSave?.({
        id: initialEvent?.id,
        title,
        description,
        imageFile: imageFile || undefined,
        videoFile: videoFile || undefined,
        imageRemoved,
        videoRemoved,
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <motion.form
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex flex-col gap-3 w-80"
      >
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-2 py-1 rounded bg-transparent border border-white text-white placeholder-white focus:outline-none"
          required
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-2 py-1 rounded bg-transparent border border-white text-white placeholder-white focus:outline-none resize-none"
          rows={4}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Upload Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="text-white"
          />
        </div>

        {/* Previews with remove buttons */}
        {(imagePreview || videoPreview) && (
          <div className="flex gap-2 mt-2">
            {imagePreview && (
              <div className="relative flex-1">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-h-48 object-contain rounded border border-white"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setImageRemoved(true);
                  }}
                >
                  ×
                </button>
              </div>
            )}
            {videoPreview && (
              <div className="relative flex-1">
                <video
                  src={videoPreview}
                  controls
                  className="max-h-48 object-contain rounded border border-white"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                    setVideoRemoved(true);
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-end mt-2">
          <div
            onClick={onClose}
            className="text-white cursor-pointer hover:opacity-70 transition-opacity px-3 py-1"
          >
            Cancel
          </div>
          <div
            onClick={handleSave}
            className="text-white cursor-pointer hover:opacity-70 transition-opacity px-3 py-1"
          >
            Save
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}
