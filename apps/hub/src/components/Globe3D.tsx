import React from 'react';
import { motion } from 'framer-motion';
import { marketplaces } from '../data/marketplaces';

export const Globe3D: React.FC = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto perspective-[1000px]">
      {/* The Globe Sphere */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Sphere Surface */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-[#1a3a5c] to-[#080C14] border border-primary/20 shadow-[0_0_50px_rgba(10,191,188,0.2)]" />
        
        {/* Latitude Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`lat-${i}`}
            className="absolute inset-0 border border-white/5 rounded-full"
            style={{
              transform: `rotateX(${(i + 1) * 30}deg) scale(1.01)`,
            }}
          />
        ))}

        {/* Longitude Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`lng-${i}`}
            className="absolute inset-0 border border-white/5 rounded-full"
            style={{
              transform: `rotateY(${(i + 1) * 30}deg) scale(1.01)`,
            }}
          />
        ))}

        {/* Marketplace Dots */}
        {marketplaces.map((m, i) => {
          // Spread dots across the globe based on index
          const lat = ((i % 5) - 2) * 30; // -60 to 60
          const lng = (i * (360 / marketplaces.length));
          
          return (
            <div
              key={m.id}
              className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `rotateY(${lng}deg) rotateX(${lat}deg) translateZ(150px) md:translateZ(250px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                className="w-full h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ backgroundColor: m.color }}
              />
              {/* Tooltip-like label (optional, might be too busy) */}
              <div className="hidden group-hover:block absolute left-4 top-0 whitespace-nowrap text-[10px] text-white font-mono bg-surface-50 px-1 rounded border border-surface-200">
                {m.name}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Atmosphere Glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_100px_rgba(10,191,188,0.1),0_0_80px_rgba(10,191,188,0.05)]" />
    </div>
  );
};
