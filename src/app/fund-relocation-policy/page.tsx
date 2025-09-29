
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Repeat, CheckCircle } from "lucide-react";

export default function FundRelocationPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <Handshake className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Fund Relocation Policy</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ensuring every dollar makes an impact.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Commitment to Impact</CardTitle>
          <CardDescription>
            At ClarityChain, our primary goal is to ensure that every donation contributes to positive change. Sometimes, circumstances change, and to maximize the impact of your generosity, we may need to reallocate funds. This policy explains how and why we do this, always with transparency at the forefront.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-6 w-6 text-primary" />
                    When Are Funds Relocated?
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold">1. Campaign is Over-Funded</h3>
                    <p className="text-muted-foreground">
                        If a campaign raises more money than its target goal, the surplus funds may be relocated. We do this to prevent funds from sitting idle when other active campaigns are in urgent need of support.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold">2. Campaign is Cancelled or Discontinued</h3>
                    <p className="text-muted-foreground">
                       In the rare event a campaign is cancelled by its creator or fails to meet critical milestones, we will relocate the raised funds to ensure donor contributions are not wasted.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold">3. Urgent Needs Arise</h3>
                    <p className="text-muted-foreground">
                        During major crises or emergencies (like a natural disaster), we may ask for your consent to relocate funds from less urgent campaigns to a dedicated disaster relief fund to provide immediate help.
                    </p>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    How Does the Process Work?
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold">1. Administrative Review</h3>
                    <p className="text-muted-foreground">
                        Our administrative team carefully reviews the situation to confirm that a fund relocation is the most effective way to use the donations.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold">2. Finding a New Home</h3>
                    <p className="text-muted-foreground">
                       We prioritize moving funds to a campaign in a similar category (e.g., from one education project to another) or to our general Operational Costs fund to support the platform.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold">3. Transparent Public Updates</h3>
                    <p className="text-muted-foreground">
                        When a fund transfer occurs, a public update is automatically posted to the "Updates" tab of both the source and destination campaigns. This record includes the amount, the reason for the transfer, and is permanently visible to all donors.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Your Consent Matters</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    By agreeing to our fund relocation policy during the donation process, you give us the flexibility to make sure your contribution has the greatest possible impact. We take this responsibility seriously and are committed to upholding the highest standards of transparency at every step. If you have any questions, please don't hesitate to contact our support team.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
