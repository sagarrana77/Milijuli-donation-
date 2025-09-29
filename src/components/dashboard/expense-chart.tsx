
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell as RechartsPrimitive } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { dashboardStats } from '@/lib/data';

interface ExpenseChartProps {
  data: typeof dashboardStats.spendingBreakdown;
}

const chartConfig = {
  value: {
    label: 'Expenses',
  },
  Education: {
    label: 'Education',
    color: 'hsl(var(--chart-1))',
  },
  Health: {
    label: 'Health',
    color: 'hsl(var(--chart-2))',
  },
  Relief: {
    label: 'Relief',
    color: 'hsl(var(--chart-3))',
  },
  Operational: {
    label: 'Operational',
    color: 'hsl(var(--chart-4))',
  },
};


export function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]
              ?.label
          }
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent
            formatter={(value) => `$${Number(value).toLocaleString()}`}
            hideLabel
            />}
        />
        <Bar dataKey="value" radius={5}>
          {data.map((entry, index) => (
            <RechartsPrimitive key={`cell-${entry.key}`} fill={`hsl(var(--chart-${index + 1}))`}/>
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
