'use client';

import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ExpenseChartProps {
  data: { name: string; value: number; fill: string }[];
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
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend
          content={({ payload }) => {
            return (
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.value}
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </PieChart>
    </ChartContainer>
  );
}
