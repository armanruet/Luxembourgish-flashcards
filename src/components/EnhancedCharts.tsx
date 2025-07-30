import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity
} from 'lucide-react';

// Simple chart components for real-time data visualization
// In a production app, you'd use Chart.js, D3.js, or Recharts

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  label,
  animated = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={animated ? { strokeDashoffset: circumference } : {}}
          animate={animated ? { strokeDashoffset } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-2xl font-bold text-gray-900"
          initial={animated ? { scale: 0 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.div>
        {label && (
          <motion.div
            className="text-xs text-gray-600 mt-1"
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  animated?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  // height = 200, // Not used in this implementation
  animated = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex-1 flex flex-col items-center"
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg relative overflow-hidden"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3B82F6'
              }}
              initial={animated ? { scaleY: 0 } : {}}
              animate={animated ? { scaleY: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              />
            </motion.div>
            
            <div className="mt-2 text-xs text-gray-600 text-center">
              <div className="font-medium">{item.value}</div>
              <div className="text-gray-500">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
  animated?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = '#3B82F6',
  animated = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - ((item.value - minValue) / range) * 100
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
  ).join(' ');

  return (
    <div className="w-full relative">
      <svg
        width="100%"
        height={height}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Line path */}
        <motion.path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="4"
            fill={color}
            initial={animated ? { scale: 0 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ComponentType<any>;
  color?: string;
  animated?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  animated = true
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 border-blue-200',
    green: 'text-green-600 bg-green-100 border-green-200',
    red: 'text-red-600 bg-red-100 border-red-200',
    purple: 'text-purple-600 bg-purple-100 border-purple-200',
    orange: 'text-orange-600 bg-orange-100 border-orange-200'
  };

  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <motion.div
      className={`p-6 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]} shadow-lg hover:shadow-xl transition-all duration-300`}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-gray-900"
            key={value}
            initial={animated ? { scale: 1.2, opacity: 0 } : {}}
            animate={animated ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm font-medium ${changeColors[changeType]}`}>
              {changeType === 'increase' && <TrendingUp className="h-4 w-4 mr-1" />}
              {changeType === 'decrease' && <TrendingDown className="h-4 w-4 mr-1" />}
              {changeType === 'neutral' && <Activity className="h-4 w-4 mr-1" />}
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-white/50 rounded-lg">
            <Icon className={`h-6 w-6 ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
  animated?: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  color = '#3B82F6',
  height = 40,
  animated = true
}) => {
  const maxValue = Math.max(...data);
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - (value / maxValue) * 100
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
  ).join(' ');

  return (
    <div className="w-full h-10">
      <svg width="100%" height={height} className="overflow-visible">
        <motion.path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  icon: Icon,
  className = ''
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

 