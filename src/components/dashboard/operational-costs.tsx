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
import { Briefcase, MonitorSmartphone } from 'lucide-react';
import { salaries, equipment } from '@/lib/data';
import { format } from 'date-fns';

export function OperationalCosts() {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Operational Costs</CardTitle>
        <CardDescription>
          A transparent look at our salaries and equipment expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="salaries">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="salaries">
              <Briefcase className="mr-2 h-4 w-4" /> Salaries
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <MonitorSmartphone className="mr-2 h-4 w-4" /> Equipment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="salaries" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaries.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell className="font-medium">{salary.employee}</TableCell>
                    <TableCell>{salary.role}</TableCell>
                    <TableCell className="text-right">
                      ${salary.salary.toLocaleString()} / mo
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="equipment" className="mt-4">
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
                    <TableCell>{format(item.purchaseDate, 'PP')}</TableCell>
                    <TableCell className="text-right">
                      ${item.cost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
