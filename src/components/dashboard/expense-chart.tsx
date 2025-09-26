
'use client';

import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { expenseData } from '@/lib/data';

interface ExpenseChartProps {
  data: typeof expenseData;
}

const chartConfig = {
  value: {
    label: 'Expenses',
  },
  education: {
    label: 'Education',
  },
  admin: {
    label: 'Admin',
  },
  relief: {
    label: 'Relief',
  },
  health: {
    label: 'Health',
  },
};

export function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="name" />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={80}
          outerRadius={120}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
