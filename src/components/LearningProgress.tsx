import React from 'react';
import { Star, StarHalf, Check } from 'lucide-react';
import { Flashcard } from '@/types';

interface LearningProgressProps {
  card: Flashcard;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LearningProgress: React.FC<LearningProgressProps> = ({ 
  card, 
  showLabel = true,
  size = 'md' 
}) => {
  // Calculate learning status
  const successRate = card.reviewCount > 0 
    ? card.successCount / card.reviewCount 
    : 0;
  
  let icon: React.ReactNode;
  let label: string;
  let colorClass: string;
  
  if (card.reviewCount === 0) {
    status = 'new';
    icon = <Star className="fill-none" />;
    label = 'New';
    colorClass = 'text-gray-400';
  } else if (successRate < 0.6) {
    status = 'learning';
    icon = <StarHalf className="fill-current" />;
    label = 'Learning';
    colorClass = 'text-amber-500';
  } else if (successRate < 0.8) {
    status = 'learned';
    icon = <Star className="fill-current" />;
    label = 'Learned';
    colorClass = 'text-emerald-500';
  } else {
    status = 'mastered';
    icon = (
      <div className="relative">
        <Star className="fill-current" />
        <Check className="absolute -bottom-1 -right-1 h-3 w-3 bg-white rounded-full" />
      </div>
    );
    label = 'Mastered';
    colorClass = 'text-emerald-600';
  }  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 ${colorClass}`}>
      <div className={sizeClasses[size]}>
        {icon}
      </div>
      {showLabel && (
        <span className={`font-medium ${textSizeClasses[size]}`}>
          {label}
          {card.reviewCount > 0 && (
            <span className="text-gray-500 ml-1">
              ({Math.round(successRate * 100)}%)
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default LearningProgress;