
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { teamMembers } from '@/lib/data';
import { getProject } from '@/services/projects-service';
import { getUser } from '@/services/donations-service';


// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => {
  if (typeof s !== 'string' || s.length === 0) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Helper to replace hyphens with spaces and capitalize words
const formatCrumb = (crumb: string) => {
  return crumb
    .replace(/-/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};

const nameCache = new Map<string, string>();

async function getNameForId(id: string, type: string): Promise<string> {
    const cacheKey = `${type}-${id}`;
    if (nameCache.has(cacheKey)) {
        return nameCache.get(cacheKey)!;
    }

    let name = formatCrumb(id);
    try {
        if (type === 'team') {
            const member = teamMembers.find(m => m.id === id);
            if (member) name = member.name;
        }
        if (type === 'profile') {
            const user = await getUser(id);
            if (user) name = user.name;
        }
        if (type === 'projects' || type === 'my-campaigns') {
            const project = await getProject(id);
            if (project) name = project.name;
        }
    } catch (error) {
        console.error(`Failed to fetch name for ${type} with id ${id}`, error);
    }
    
    nameCache.set(cacheKey, name);
    return name;
}

function Crumb({ segment, href, isLast }: { segment: string, href: string, isLast: boolean }) {
    const [label, setLabel] = React.useState(formatCrumb(segment));

    React.useEffect(() => {
        const pathSegments = href.split('/').filter(Boolean);
        const currentSegment = pathSegments[pathSegments.length - 1];
        const prevSegment = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : '';

        if (['team', 'profile', 'projects', 'my-campaigns'].includes(prevSegment)) {
            getNameForId(currentSegment, prevSegment).then(setLabel);
        } else if (prevSegment === 'admin' && currentSegment === 'projects') {
            setLabel('Projects');
        } else {
            setLabel(formatCrumb(segment));
        }
    }, [segment, href]);


    if (isLast) {
        return <BreadcrumbPage>{label}</BreadcrumbPage>;
    }

    return (
        <BreadcrumbLink asChild>
            <Link href={href}>{label}</Link>
        </BreadcrumbLink>
    );
}


export function Breadcrumbs({ title }: { title: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((i) => i);

  // Don't show breadcrumbs on the homepage
  if (pathSegments.length === 0) {
    return (
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-semibold md:text-2xl whitespace-nowrap">{title}</h1>
      <BreadcrumbSeparator />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = '/' + pathSegments.slice(0, index + 1).join('/');

            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Crumb segment={segment} href={href} isLast={isLast} />
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
