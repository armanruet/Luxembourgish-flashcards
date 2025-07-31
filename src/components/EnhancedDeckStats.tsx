import React from 'react';
import { 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  BookOpen 
} from 'lucide-react';
import { getEnhancedDeckStats } from '@/utils/cardStatus';
import { Deck } from '@/types';

interface EnhancedDeckStatsProps {
  deck: Deck;
  showDetailedView?: boolean;
}

export const EnhancedDeckStats: React.FC<EnhancedDeckStatsProps> = ({ 
  deck, 
  showDetailedView = false 
}) => {
  const stats = getEnhancedDeckStats(deck);

  if (!showDetailedView) {
    // Compact view for deck list
    return (
      <div className="space-y-3">
        {/* Main Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Learning Progress</span>
            <span>{stats.learned + stats.mastered}/{stats.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="flex h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500"
                style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
              />
              <div 
                className="bg-blue-400"
                style={{ width: `${(stats.learned / stats.total) * 100}%` }}
              />
              <div 
                className="bg-yellow-400"
                style={{ width: `${(stats.learning / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Due Status Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-red-50 rounded-lg p-2 border border-red-100">
            <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-red-700">Overdue</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
            <div className="text-lg font-bold text-amber-600">{stats.dueToday}</div>
            <div className="text-xs text-amber-700">Today</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            <div className="text-lg font-bold text-emerald-600">{stats.dueSoon}</div>
            <div className="text-xs text-emerald-700">Soon</div>
          </div>
        </div>

        {/* Learning Status Row */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="text-gray-500">
            <div className="font-medium">{stats.new}</div>
            <div>New</div>
          </div>
          <div className="text-yellow-600">
            <div className="font-medium">{stats.learning}</div>
            <div>Learning</div>
          </div>
          <div className="text-blue-600">
            <div className="font-medium">{stats.learned}</div>
            <div>Learned</div>
          </div>
          <div className="text-green-600">
            <div className="font-medium">{stats.mastered}</div>
            <div>Mastered</div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed view for deck page
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BookOpen className="h-5 w-5 mr-2" />
        Deck Statistics
      </h3>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Cards</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
          <div className="text-sm text-green-700">Mastered</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-700">Overdue</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(stats.averageSuccessRate * 100)}%
          </div>
          <div className="text-sm text-blue-700">Success Rate</div>
        </div>
      </div>

      {/* Learning Progress Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Learning Progress</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress Distribution</span>
            <span>{Math.round(((stats.learned + stats.mastered) / stats.total) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div 
                className="bg-green-500"
                style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
                title={`Mastered: ${stats.mastered}`}
              />
              <div 
                className="bg-blue-400"
                style={{ width: `${(stats.learned / stats.total) * 100}%` }}
                title={`Learned: ${stats.learned}`}
              />
              <div 
                className="bg-yellow-400"
                style={{ width: `${(stats.learning / stats.total) * 100}%` }}
                title={`Learning: ${stats.learning}`}
              />
              <div 
                className="bg-gray-300"
                style={{ width: `${(stats.new / stats.total) * 100}%` }}
                title={`New: ${stats.new}`}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>🟢 Mastered ({stats.mastered})</span>
            <span>🔵 Learned ({stats.learned})</span>
            <span>🟡 Learning ({stats.learning})</span>
            <span>⚪ New ({stats.new})</span>
          </div>
        </div>
      </div>

      {/* Due Status Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Review Schedule
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <div className="font-semibold text-red-900">{stats.overdue}</div>
              <div className="text-xs text-red-700">Overdue</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Clock className="h-8 w-8 text-amber-500 mr-3" />
            <div>
              <div className="font-semibold text-amber-900">{stats.dueToday}</div>
              <div className="text-xs text-amber-700">Due Today</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <Calendar className="h-8 w-8 text-emerald-500 mr-3" />
            <div>
              <div className="font-semibold text-emerald-900">{stats.dueSoon}</div>
              <div className="text-xs text-emerald-700">Due Soon</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="font-semibold text-blue-900">{stats.dueThisWeek}</div>
              <div className="text-xs text-blue-700">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-2">
          {stats.overdue > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              {stats.overdue} cards need immediate attention
            </span>
          )}
          {stats.dueToday > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <Clock className="h-3 w-3 mr-1" />
              {stats.dueToday} cards due today
            </span>
          )}
          {stats.new > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <BookOpen className="h-3 w-3 mr-1" />
              {stats.new} new cards to learn
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeckStats;
