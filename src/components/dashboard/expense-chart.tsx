
'use client';

import { RadialBar, RadialBarChart, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

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
      className="mx-auto aspect-square h-[300px]"
    >
      <RadialBarChart
        data={data}
        innerRadius="50%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
      >
        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" />} />
        <RadialBar
            dataKey="value"
            background
            cornerRadius={10}
        />
        <Legend
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          content={({ payload }) => {
            return (
              <ul className="flex flex-col gap-2 text-sm">
                {payload?.map((entry, index) => {
                  const matchingData = data.find(d => d.name === entry.value);
                  return (
                  <li key={`item-${index}`} className="flex items-center gap-2 rounded-md bg-background/80 px-2 py-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-foreground">{entry.value} ({matchingData?.value}%)</span>
                  </li>
                )})}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
