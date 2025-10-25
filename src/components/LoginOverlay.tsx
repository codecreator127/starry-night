'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoginOverlayProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginOverlay({ onClose, onLoginSuccess }: LoginOverlayProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    // Simple mock login: accept any non-empty input
    console.log('Login:', { user, pass });
    if (user && pass) {
      onLoginSuccess();
    }
  };

  // Close on Escape
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
      <motion.form
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(); // will run on Enter
        }}
        className="flex flex-col gap-3 w-64"
      >
        <input
          type="text"
          placeholder="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="px-2 py-1 rounded bg-transparent border border-white text-white placeholder-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="pass"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="px-2 py-1 rounded bg-transparent border border-white text-white placeholder-white focus:outline-none"
          required
        />
        <button
          type="submit"
          className="text-white cursor-pointer text-center hover:opacity-70 transition-opacity bg-transparent border-none p-0"
        >
          Login
        </button>
      </motion.form>
    </motion.div>
  );
}
