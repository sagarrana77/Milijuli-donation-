
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  Users,
  HeartHandshake,
  Briefcase,
  HandCoins,
} from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { OperationalCosts } from '@/components/dashboard/operational-costs';
import { dashboardStats, expenseData } from '@/lib/data';
import { RealtimeLedger } from '@/components/dashboard/realtime-ledger';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Funds Raised
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardStats.totalFunds.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +${dashboardStats.monthlyIncrease.toLocaleString()} from last
              month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds in Hand</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardStats.fundsInHand.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining funds after all expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Funds Spent
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardStats.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Includes project and operational costs
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RealtimeLedger />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                How funds are being allocated across categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ExpenseChart data={expenseData} />
              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                  {expenseData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                          <span className="text-foreground">{entry.name}</span>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <OperationalCosts />
    </div>
  );
}
