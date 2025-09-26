import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, HeartHandshake } from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { OperationalCosts } from '@/components/dashboard/operational-costs';
import {
  dashboardStats,
  expenseData,
} from '@/lib/data';

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
              +${dashboardStats.monthlyIncrease.toLocaleString()} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalDonors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.newDonors} new donors this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects Funded
            </CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.projectsFunded}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {dashboardStats.countries} countries
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <OperationalCosts />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              How project funds are being allocated across categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
