'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { teamMembers } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

export default function AdminAboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Manage About Page</h1>
        <p className="text-muted-foreground">
          Update the content displayed on your organization's "About Us" page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Main Sections</CardTitle>
          <CardDescription>
            Edit the primary text content for the About page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mission">Our Mission</Label>
            <Textarea
              id="mission"
              rows={5}
              defaultValue="Our mission is to bring radical transparency to the world of fundraising and charitable donations. We believe that every donor has the right to know exactly how their contributions are being used to make a difference. ClarityChain provides a secure, auditable, and easy-to-understand platform that tracks funds from the moment they are donated to the point of expenditure, ensuring accountability and rebuilding trust in the non-profit sector."
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="hero-tagline">Hero Section Tagline</Label>
            <Textarea
              id="hero-tagline"
              rows={2}
              defaultValue="Driving transparency and trust in charitable giving through technology."
            />
          </div>
          <Button>Save All Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Add, edit, or remove team members from the About page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
          <CardDescription>
            Manage the core values highlighted on your page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="mb-4 flex justify-end">
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Value
                </Button>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <div className="space-y-2">
                    <Label htmlFor="value-title-1">Value Title</Label>
                    <Input id="value-title-1" defaultValue="Transparency" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="value-desc-1">Value Description</Label>
                    <Textarea id="value-desc-1" defaultValue="We are committed to complete openness in how funds are raised, managed, and spent. Every transaction is public." />
                </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <div className="space-y-2">
                    <Label htmlFor="value-title-2">Value Title</Label>
                    <Input id="value-title-2" defaultValue="Accountability" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="value-desc-2">Value Description</Label>
                    <Textarea id="value-desc-2" defaultValue="We hold ourselves to the highest standards, ensuring that all stakeholders can verify our actions and their impact." />
                </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
                <div className="space-y-2">
                    <Label htmlFor="value-title-3">Value Title</Label>
                    <Input id="value-title-3" defaultValue="Impact" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="value-desc-3">Value Description</Label>
                    <Textarea id="value-desc-3" defaultValue="Our ultimate goal is to maximize the positive impact of every donation, creating lasting change in communities." />
                </div>
            </div>
            <Button>Save Values</Button>
        </CardContent>
      </Card>
    </div>
  );
}
