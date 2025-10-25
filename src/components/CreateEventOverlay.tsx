'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CreateEventOverlayProps {
  onClose: () => void;
  onSave?: (event: {
    title: string;
    description: string;
    imageFile?: File;
    videoFile?: File;
  }) => void;
}

export default function CreateEventOverlay({ onClose, onSave }: CreateEventOverlayProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Update previews when files change
  useEffect(() => {
    if (imageFile) setImagePreview(URL.createObjectURL(imageFile));
    else setImagePreview(null);

    if (videoFile) setVideoPreview(URL.createObjectURL(videoFile));
    else setVideoPreview(null);

    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imageFile, videoFile]);

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
        title,
        description,
        imageFile: imageFile || undefined,
        videoFile: videoFile || undefined,
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
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Upload Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
            className="text-white"
          />
        </div>

        {/* Previews side by side */}
        {(imagePreview || videoPreview) && (
          <div className="flex gap-2 mt-2">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="flex-1 max-h-48 object-contain rounded border border-white"
              />
            )}
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="flex-1 max-h-48 object-contain rounded border border-white"
              />
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
