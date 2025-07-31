import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';
import { Calendar, TrendingUp } from 'lucide-react';
import { Flashcard } from '@/types';
import { getDueCardsForecast } from '@/utils/cardStatus';

interface WorkloadCalendarProps {
  cards: Flashcard[];
  monthsToShow?: number;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({ 
  cards, 
  monthsToShow = 2 
}) => {
  const forecast = useMemo(() => getDueCardsForecast(cards, 60), [cards]);
  
  // Generate calendar months
  const months = useMemo(() => {
    const now = new Date();
    const monthsData = [];
    
    for (let i = 0; i < monthsToShow; i++) {
      const monthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() + i));
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      monthsData.push({
        month: monthStart,
        days: days.map(day => {
          const forecastDay = forecast.find(f => isSameDay(f.date, day));
          return {
            date: day,
            count: forecastDay?.count || 0
          };
        })
      });
    }
    
    return monthsData;
  }, [forecast, monthsToShow]);

  // Calculate workload intensity colors
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-400';
    if (count <= 5) return 'bg-green-100 text-green-800';
    if (count <= 15) return 'bg-yellow-100 text-yellow-800';
    if (count <= 25) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntensityLevel = (count: number) => {
    if (count === 0) return 'None';
    if (count <= 5) return 'Light';
    if (count <= 15) return 'Moderate';
    if (count <= 25) return 'Heavy';
    return 'Intense';
  };

  // Calculate weekly totals
  const getWeeklyStats = () => {
    const thisWeek = forecast.slice(0, 7).reduce((sum, day) => sum + day.count, 0);
    const nextWeek = forecast.slice(7, 14).reduce((sum, day) => sum + day.count, 0);
    const following = forecast.slice(14, 21).reduce((sum, day) => sum + day.count, 0);
    
    return { thisWeek, nextWeek, following };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Study Workload Forecast
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          Next {monthsToShow} months
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{weeklyStats.thisWeek}</div>
          <div className="text-sm text-blue-700">This Week</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{weeklyStats.nextWeek}</div>
          <div className="text-sm text-purple-700">Next Week</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="text-xl font-bold text-indigo-600">{weeklyStats.following}</div>
          <div className="text-sm text-indigo-700">Following Week</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {months.map(({ month, days }) => (
          <div key={month.toISOString()}>
            <h4 className="text-md font-medium text-gray-700 mb-3">
              {format(month, 'MMMM yyyy')}
            </h4>
            
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: month.getDay() }).map((_, index) => (
                <div key={index} className="h-10" />
              ))}
              
              {/* Month days */}
              {days.map(({ date, count }) => {
                const isPast = isBefore(date, new Date()) && !isToday(date);
                const isCurrentDay = isToday(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`
                      h-10 rounded-md border flex items-center justify-center text-xs font-medium
                      cursor-pointer transition-all duration-200 hover:scale-105
                      ${getIntensityColor(count)}
                      ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      ${isPast ? 'opacity-60' : ''}
                    `}
                    title={`${format(date, 'MMM d')}: ${count} cards due (${getIntensityLevel(count)} workload)`}
                  >
                    <div className="text-center">
                      <div className={`text-xs ${isCurrentDay ? 'font-bold' : ''}`}>
                        {format(date, 'd')}
                      </div>
                      {count > 0 && (
                        <div className="text-xs leading-none mt-0.5">
                          {count}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Workload Intensity:</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-gray-100 border"></div>
              <span className="text-xs text-gray-500">None</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-green-100 border"></div>
              <span className="text-xs text-gray-500">Light (1-5)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-yellow-100 border"></div>
              <span className="text-xs text-gray-500">Moderate (6-15)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-orange-100 border"></div>
              <span className="text-xs text-gray-500">Heavy (16-25)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-red-100 border"></div>
              <span className="text-xs text-gray-500">Intense (25+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkloadCalendar;
