import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'accent' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, trend, color = 'default' }) => {
  const getColorClass = () => {
    switch (trend) {
      case 'up': return 'text-accent-up';
      case 'down': return 'text-accent-down';
      default: return 'text-institutional-100';
    }
  };

  const getBorderColor = () => {
    if (color === 'accent') return 'border-l-4 border-accent-info';
    if (color === 'danger') return 'border-l-4 border-accent-down';
    return 'border-l-4 border-institutional-600';
  };

  return (
    <div className={`bg-institutional-800 p-4 rounded-r shadow-sm ${getBorderColor()}`}>
      <div className="text-xs text-institutional-500 uppercase tracking-wider font-semibold mb-1">{label}</div>
      <div className={`text-2xl font-mono font-medium ${getColorClass()}`}>
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-institutional-500 mt-1">
          {subValue}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
