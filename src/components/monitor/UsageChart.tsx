import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { UsageStats } from '../../types';

interface UsageChartProps {
  data: UsageStats;
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-dark-900">调用量趋势</h3>
          <p className="text-sm text-dark-500 mt-1">近7天数据</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{data.totalCalls.toLocaleString()}</p>
          <p className="text-sm text-dark-500">本月总调用</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.trends}>
          <defs>
            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E8ECF1' }}
            axisLine={{ stroke: '#E8ECF1' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E8ECF1' }}
            axisLine={{ stroke: '#E8ECF1' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E8ECF1',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(30, 58, 95, 0.1)',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}月${date.getDate()}日`;
            }}
          />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="#1E3A5F"
            strokeWidth={2}
            fill="url(#colorCalls)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
