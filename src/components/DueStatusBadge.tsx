import React from 'react';
import { formatDistanceToNow, isBefore, differenceInDays } from 'date-fns';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Flashcard } from '@/types';

interface DueStatusBadgeProps {
  card: Flashcard;
  showRelativeTime?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DueStatusBadge: React.FC<DueStatusBadgeProps> = ({ 
  card, 
  showRelativeTime = true,
  size = 'md' 
}) => {
  const now = new Date();
  const dueDate = new Date(card.nextReview);
  const daysDiff = differenceInDays(dueDate, now);
  
  // Determine status
  let statusColor: string;
  let statusIcon: React.ReactNode;
  let statusText: string;
  
  // Check if card is learned
  const isLearned = card.reviewCount > 0 && 
    (card.successCount / card.reviewCount) >= 0.8;
  
  if (isLearned && daysDiff > 7) {
    statusColor = 'bg-green-100 text-green-800 border-green-300';
    statusIcon = <CheckCircle className="h-3 w-3" />;
    statusText = 'Learned';
  } else if (isBefore(dueDate, now)) {
    statusColor = 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    statusIcon = <AlertCircle className="h-3 w-3" />;
    statusText = showRelativeTime 
      ? `${formatDistanceToNow(dueDate)} overdue`
      : 'Overdue';
  } else if (daysDiff === 0) {
    statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
    statusIcon = <Clock className="h-3 w-3" />;
    statusText = 'Due today';
  } else if (daysDiff <= 3) {
    statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    statusIcon = <Clock className="h-3 w-3" />;
    statusText = showRelativeTime
      ? `Due in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`
      : 'Due soon';
  } else {
    statusColor = 'bg-gray-100 text-gray-600 border-gray-300';
    statusIcon = null;
    statusText = showRelativeTime
      ? `Due in ${formatDistanceToNow(dueDate)}`
      : 'Not due';
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full border font-medium
      ${statusColor} ${sizeClasses[size]}
    `}>
      {statusIcon}
      {statusText}
    </span>
  );
};

export default DueStatusBadge;
