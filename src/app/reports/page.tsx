import { ReportGenerator } from '@/components/reports/report-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <FileText className="h-10 w-10 text-primary" />
        <div>
            <h1 className="text-3xl font-bold">AI Summary Reports</h1>
            <p className="text-muted-foreground">
            Auto-generate simple, donor-friendly updates from raw financial data.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Generate a Donor-Friendly Report</CardTitle>
            <CardDescription>
                Enter your fund allocation data below. For example: "Education: $5000, Admin: $1200, Health Supplies: $3800". The AI will create a concise summary.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
