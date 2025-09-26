import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Users, HeartHandshake } from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import {
  dashboardStats,
  recentDonations,
  expenseData,
} from '@/lib/data';
import { format } from 'date-fns';

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Real-time Ledger</CardTitle>
            <CardDescription>
              A live feed of all incoming donations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={donation.donor.avatarUrl}
                            alt={donation.donor.name}
                          />
                          <AvatarFallback>
                            {donation.donor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{donation.donor.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{donation.project}</TableCell>
                    <TableCell className="text-right">
                      ${donation.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {format(donation.date, 'PP')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              How funds are being allocated across categories.
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
