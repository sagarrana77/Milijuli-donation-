
'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
    color: 'hsl(var(--chart-1))',
  },
  admin: {
    label: 'Admin',
    color: 'hsl(var(--chart-2))',
  },
  relief: {
    label: 'Relief',
    color: 'hsl(var(--chart-3))',
  },
  health: {
    label: 'Health',
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
            chartConfig[value.toLowerCase() as keyof typeof chartConfig]
              ?.label
          }
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
