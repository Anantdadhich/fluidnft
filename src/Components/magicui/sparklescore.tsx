"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  particleDensity = 50,
  particleColor,
}: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}) => {
  const [particles, setParticles] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: React.JSX.Element[] = [];

      for (let i = 0; i < particleDensity; i++) {
        const size = Math.random() * (maxSize || 1.4) + (minSize || 0.6);
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;

        const particleStyle: React.CSSProperties = {
          position: "absolute",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: particleColor || "#ffffff",
          borderRadius: "50%",
          opacity: 0,
        };

        newParticles.push(
          <motion.span
            key={`particle-${i}`}
            style={particleStyle}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              y: 50,
              x: 50
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              y: [50, 0, -50],
              x: [50, 0, -50],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        );
      }

      setParticles(newParticles);
    };

    generateParticles();
  }, [particleDensity, minSize, maxSize, particleColor]);

  return (
    <div
      id={id}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: background || "transparent",
      }}
    >
      {particles}
    </div>
  );
};