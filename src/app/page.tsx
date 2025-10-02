

import { getProjects } from '@/services/projects-service';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { getUsers, getInKindDonations } from '@/services/donations-service';
import { allDonations as initialAllDonations, salaries, equipment, miscExpenses } from '@/lib/data';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';


export default async function DashboardPage() {
    const projects = await getProjects();
    const users = await getUsers();
    const physicalDonations = await getInKindDonations();

    const calculateSpendingBreakdown = () => {
        const totalSalaryCosts = salaries.reduce((acc, s) => {
            const nprAmount = s.currency === 'USD' ? s.salary * 133 : s.salary;
            return acc + nprAmount;
        }, 0);
        const totalEquipmentCosts = equipment.reduce((acc, e) => acc + e.cost, 0);
        const totalMiscCosts = miscExpenses.reduce((acc, e) => acc + e.cost, 0);
        const currentOperationalExpenses = (totalSalaryCosts * 12) + totalEquipmentCosts + totalMiscCosts;

        const educationExpenses = projects
            .filter(p => p.id === 'education-for-all-nepal')
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
        
        const healthExpenses = projects
            .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

        const reliefExpenses = projects
            .filter(p => p.id === 'disaster-relief-fund')
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

        return [
            { name: 'Education', value: educationExpenses, key: 'education' },
            { name: 'Health', value: healthExpenses, key: 'health' },
            { name: 'Relief', value: reliefExpenses, key: 'relief' },
            { name: 'Operational', value: currentOperationalExpenses, key: 'operational' },
        ];
    };
    
    const spendingBreakdown = calculateSpendingBreakdown();
    
  return (
    <div className="flex flex-col gap-8">
        <ScrollFadeIn>
            <CampaignHeroSlider projects={projects} />
        </ScrollFadeIn>

        <DashboardStats allProjects={projects} physicalDonations={physicalDonations} users={users} />

        <ScrollFadeIn asChild>
            <InKindDonationsSlider allProjects={projects} physicalDonations={physicalDonations} users={users} />
        </ScrollFadeIn>

        <ScrollFadeIn>
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                    How funds are being allocated across categories.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <ExpenseChart data={spendingBreakdown} />
                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                    {spendingBreakdown.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }} />
                        <span className="font-medium">{entry.name}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </ScrollFadeIn>
    </div>
  );
}
