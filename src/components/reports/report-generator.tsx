'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateDonorFriendlyReport,
  GenerateDonorFriendlyReportOutput,
} from '@/ai/flows/generate-donor-friendly-reports';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  fundAllocationData: z.string().min(10, {
    message: 'Please provide more detailed allocation data.',
  }),
});

export function ReportGenerator() {
  const [report, setReport] = useState<GenerateDonorFriendlyReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fundAllocationData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateDonorFriendlyReport(values);
      setReport(result);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'There was a problem communicating with the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fundAllocationData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fund Allocation Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Student Scholarships: $8,000, Administrative Costs: $1,500, Medical Supplies: $3,500"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </form>
      </Form>

      {report && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Generated AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{report.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
