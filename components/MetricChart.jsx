import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';

/**
 * Reusable chart component for displaying sleep metrics over time
 */
const MetricChart = ({
  data,
  dataKey,
  smoothDataKey,
  title,
  description,
  color,
  yMin,
  yMax,
  comparisonDates = []
}) => {
  const [showSmoothed, setShowSmoothed] = useState(true);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button
          onClick={() => setShowSmoothed(!showSmoothed)}
          className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded transition-colors border border-white/20"
        >
          {showSmoothed ? 'Show Raw' : 'Show Smoothed'}
        </button>
      </div>
      {description && (
        <p className="text-blue-100 text-xs mb-3">{description}</p>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="date" stroke="#93c5fd" angle={-45} textAnchor="end" height={100} />
          <YAxis domain={[yMin, yMax]} stroke="#93c5fd" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: `2px solid ${color}`,
              borderRadius: '8px',
              color: '#1e293b'
            }}
            labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
            itemStyle={{ color: '#1e293b' }}
          />
          <Legend />
          {comparisonDates.filter(cd => cd.date).map((cd, idx) => {
            // Parse the date from YYYY-MM-DD format and format to match chart data
            const [year, month, day] = cd.date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const formattedDate = dateObj.toLocaleDateString('en-US');

            return (
              <ReferenceLine
                key={idx}
                x={formattedDate}
                stroke={['#ef4444', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4'][idx % 5]}
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: cd.label || `Change ${idx + 1}`,
                  position: 'top',
                  fill: '#ffffff',
                  fontSize: 12
                }}
              />
            );
          })}
          {showSmoothed ? (
            <>
              <Line type="monotone" dataKey={dataKey} stroke={`${color}22`} strokeWidth={1} dot={false} name="Raw" />
              <Line type="monotone" dataKey={smoothDataKey} stroke={color} strokeWidth={3} dot={false} name="Smoothed" />
            </>
          ) : (
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} name="Raw" />
          )}
          <Brush dataKey="date" height={30} stroke={color} fill="#1e293b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
