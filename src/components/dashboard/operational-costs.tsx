

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { salaries as SalariesType, equipment as EquipmentType, miscExpenses as MiscExpensesType, teamMembers as TeamMembersType } from '@/lib/data';
import { platformSettings } from '@/lib/data';
import { Briefcase, MonitorSmartphone, Archive } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Separator } from '../ui/separator';

interface OperationalCostsProps {
    salaries: SalariesType;
    equipment: EquipmentType;
    miscExpenses: MiscExpensesType;
    teamMembers: TeamMembersType;
}

const TAX_RATE = 0.13; // 13% VAT for demonstration

export function OperationalCosts({ salaries, equipment, miscExpenses, teamMembers }: OperationalCostsProps) {
    const findTeamMemberId = (employeeName: string) => {
        const member = teamMembers.find(m => m.name === employeeName);
        return member ? member.id : null;
    }

    const calculateSubtotal = (items: { cost: number }[] | { salary: number, currency: 'NPR' | 'USD' }[]) => {
        return items.reduce((acc, item) => {
            if ('salary' in item) { // It's a salary item
                const nprAmount = item.currency === 'USD' ? item.salary * 133 : item.salary;
                return acc + nprAmount;
            }
            return acc + (item as {cost: number}).cost;
        }, 0);
    };

    const salariesSubtotal = calculateSubtotal(salaries);
    const equipmentSubtotal = calculateSubtotal(equipment);
    const miscSubtotal = calculateSubtotal(miscExpenses);
    
    const grandSubtotal = salariesSubtotal + equipmentSubtotal + miscSubtotal;
    const taxAmount = grandSubtotal * TAX_RATE;
    const grandTotal = grandSubtotal + taxAmount;
    
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
                 {platformSettings.showOperationalCostsTotal && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2} className="font-semibold">Salaries Subtotal</TableCell>
                            <TableCell className="text-right font-semibold">Rs.{salariesSubtotal.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
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
                 {platformSettings.showOperationalCostsTotal && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="font-semibold">Equipment Subtotal</TableCell>
                            <TableCell className="text-right font-semibold">Rs.{equipmentSubtotal.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
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
                {platformSettings.showOperationalCostsTotal && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="font-semibold">Miscellaneous Subtotal</TableCell>
                            <TableCell className="text-right font-semibold">Rs.{miscSubtotal.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
                </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
       {platformSettings.showOperationalCostsTotal && (
         <>
            <Separator className="my-4" />
            <CardFooter className="flex flex-col items-end gap-2 p-6 pt-0">
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>Rs.{grandSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                    <span>Government Taxes ({(TAX_RATE * 100).toFixed(0)}%):</span>
                    <span>Rs.{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-lg font-bold">
                    <span>Grand Total:</span>
                    <span className="text-primary">Rs.{grandTotal.toLocaleString()}</span>
                </div>
            </CardFooter>
        </>
      )}
    </Card>
  );
}

    