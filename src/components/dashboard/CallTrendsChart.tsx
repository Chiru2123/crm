
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CallTrend } from '@/types/types';

interface CallTrendsChartProps {
  trends: CallTrend[];
}

const CallTrendsChart: React.FC<CallTrendsChartProps> = ({ trends }) => {
  // Format the dates to be more readable
  const formattedTrends = trends.map(trend => {
    const date = new Date(trend.date);
    return {
      ...trend,
      formattedDate: date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      })
    };
  });

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Call Trends (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="formattedDate" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value) => [`${value} calls`, 'Total']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="calls" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                name="Calls"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTrendsChart;
