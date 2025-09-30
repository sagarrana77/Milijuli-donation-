
'use client';

import { useState } from 'react';
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
import {
  teamMembers,
  values,
  aboutContent
} from '@/lib/data';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminAboutPage() {
  const { toast } = useToast();
  // We use local state to manage edits before saving.
  const [mission, setMission] = useState(aboutContent.mission);
  const [tagline, setTagline] = useState(aboutContent.tagline);
  const [localValues, setLocalValues] = useState(JSON.parse(JSON.stringify(values)));
  const [_, setForceRender] = useState(0);

  const handleSaveChanges = () => {
    // Save changes to the "source of truth"
    aboutContent.mission = mission;
    aboutContent.tagline = tagline;
    toast({
      title: 'Content Saved!',
      description:
        'Your changes to the main sections have been saved.',
    });
    setForceRender(c => c + 1);
  };
  
  const handleSaveValues = () => {
     // Replace the original array with the new one
     values.length = 0;
     Array.prototype.push.apply(values, localValues);
     toast({
      title: 'Values Saved!',
      description:
        'Your changes to the core values have been saved.',
    });
    setForceRender(c => c + 1);
  }

  const handleAddValue = () => {
      setLocalValues([...localValues, { title: 'New Value', description: 'New description' }]);
  }

  const handleDeleteValue = (index: number) => {
      setLocalValues(localValues.filter((_: any, i: number) => i !== index));
  }
  
  const handleValueChange = (index: number, field: 'title' | 'description', value: string) => {
      const newValues = [...localValues];
      newValues[index][field] = value;
      setLocalValues(newValues);
  }

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
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-tagline">Hero Section Tagline</Label>
            <Textarea
              id="hero-tagline"
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveChanges}>Save All Changes</Button>
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
                  <TableCell className="font-medium"><Link href={`/team/${member.id}`} className="hover:underline text-primary">{member.name}</Link></TableCell>
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
            <Button onClick={handleAddValue}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Value
            </Button>
          </div>
          {localValues.map((value: { title: string, description: string }, index: number) => (
             <div key={index} className="space-y-4 rounded-md border p-4">
                <div className="space-y-2">
                    <Label htmlFor={`value-title-${index}`}>Value Title</Label>
                    <Input id={`value-title-${index}`} value={value.title} onChange={(e) => handleValueChange(index, 'title', e.target.value)}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`value-desc-${index}`}>Value Description</Label>
                    <Textarea id={`value-desc-${index}`} value={value.description} onChange={(e) => handleValueChange(index, 'description', e.target.value)}/>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteValue(index)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Value
                </Button>
            </div>
          ))}
          <Button onClick={handleSaveValues}>Save Values</Button>
        </CardContent>
      </Card>
    </div>
  );
}

    