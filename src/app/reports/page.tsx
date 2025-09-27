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
              Automatically generate simple, donor-friendly updates from your project data.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Generate a Project Report</CardTitle>
            <CardDescription>
                Select a project from the dropdown below. The AI will analyze its current financial status and generate a concise, shareable summary for your donors.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
