

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { salaries as SalariesType, equipment as EquipmentType, miscExpenses as MiscExpensesType, teamMembers as TeamMembersType } from '@/lib/data';
import { Briefcase, MonitorSmartphone, Archive } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface OperationalCostsProps {
    salaries: SalariesType;
    equipment: EquipmentType;
    miscExpenses: MiscExpensesType;
    teamMembers: TeamMembersType;
}

export function OperationalCosts({ salaries, equipment, miscExpenses, teamMembers }: OperationalCostsProps) {
    const findTeamMemberId = (employeeName: string) => {
        const member = teamMembers.find(m => m.name === employeeName);
        return member ? member.id : null;
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Costs</CardTitle>
        <CardDescription>
          A transparent breakdown of our salary and equipment expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="salaries">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="salaries">
              <Briefcase className="mr-2 h-4 w-4" /> Salaries
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <MonitorSmartphone className="mr-2 h-4 w-4" /> Equipment
            </TabsTrigger>
            <TabsTrigger value="misc">
              <Archive className="mr-2 h-4 w-4" /> Misc
            </TabsTrigger>
          </TabsList>
          <TabsContent value="salaries" className="mt-4">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Monthly Salary</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salaries.map((salary) => {
                    const memberId = findTeamMemberId(salary.employee);
                    return (
                        <TableRow key={salary.id}>
                        <TableCell className="font-medium">
                            {memberId ? (
                                <Link href={`/team/${memberId}`} className="hover:underline text-primary">
                                    {salary.employee}
                                </Link>
                            ) : (
                                salary.employee
                            )}
                        </TableCell>
                        <TableCell>{salary.role}</TableCell>
                        <TableCell className="text-right">
                            {salary.currency === 'USD' ? '$' : 'Rs.'}{salary.salary.toLocaleString()}
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </div>
          </TabsContent>
          <TabsContent value="equipment" className="mt-4">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipment.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.vendor}</TableCell>
                        <TableCell>{format(new Date(item.purchaseDate), 'PP')}</TableCell>
                        <TableCell className="text-right">
                        Rs.{item.cost.toLocaleString()}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </TabsContent>
          <TabsContent value="misc" className="mt-4">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {miscExpenses.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.vendor}</TableCell>
                        <TableCell>{format(new Date(item.purchaseDate), 'PP')}</TableCell>
                        <TableCell className="text-right">
                        Rs.{item.cost.toLocaleString()}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
