import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  pulseOnChange?: boolean;
  children?: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  className = '',
  showPercentage = true,
  animated = true,
  pulseOnChange = false,
  children
}) => {
  const normalizedRadius = (size - strokeWidth * 2) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.svg
        height={size}
        width={size}
        className="transform -rotate-90"
        animate={pulseOnChange ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Background circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={animated ? { strokeDashoffset } : {}}
          transition={animated ? { 
            duration: 0.8, 
            ease: "easeInOut",
            delay: 0.2
          } : {}}
        />
      </motion.svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <motion.div
            className="text-center"
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={animated ? { scale: 1, opacity: 1 } : {}}
            transition={animated ? { delay: 0.5, duration: 0.3 } : {}}
          >
            <motion.span
              className="text-2xl font-bold text-gray-900"
              key={progress}
              initial={{ scale: 1 }}
              animate={pulseOnChange ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;