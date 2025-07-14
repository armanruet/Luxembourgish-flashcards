import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  colorThresholds?: {
    good: number;
    warning: number;
    danger: number;
  };
  celebration?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = '',
  suffix = '',
  prefix = '',
  colorThresholds,
  celebration = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Spring animation for smooth counting
  const spring = useSpring(displayValue, {
    stiffness: 60,
    damping: 15,
    mass: 1
  });
  
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);
  
  // Determine color based on thresholds
  const getColor = (currentValue: number) => {
    if (!colorThresholds) return 'text-gray-900';
    
    if (currentValue >= colorThresholds.good) return 'text-green-600';
    if (currentValue >= colorThresholds.warning) return 'text-yellow-600';
    if (currentValue <= colorThresholds.danger) return 'text-red-600';
    
    return 'text-gray-900';
  };
  
  return (
    <motion.span
      className={`${className} ${getColor(value)} transition-colors duration-300`}
      animate={celebration ? {
        scale: [1, 1.2, 1],
        color: ['#059669', '#dc2626', '#059669']
      } : {}}
      transition={{
        scale: { duration: 0.3, repeat: celebration ? 2 : 0 },
        color: { duration: 0.2, repeat: celebration ? 4 : 0 }
      }}
    >
      {prefix}
      <motion.span>
        {Math.round(spring.get())}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;