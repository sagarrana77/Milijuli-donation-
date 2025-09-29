
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
import { projects, teamMembers, users } from '@/lib/data';


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

const getNameForId = (id: string, type: 'team' | 'profile' | 'projects' | 'my-campaigns') => {
    if (type === 'team') {
        const member = teamMembers.find(m => m.id === id);
        return member ? member.name : formatCrumb(id);
    }
    if (type === 'profile') {
        const user = users.find(u => u.id === id);
        return user ? user.name : formatCrumb(id);
    }
     if (type === 'projects' || type === 'my-campaigns') {
        const project = projects.find(p => p.id === id);
        return project ? project.name : formatCrumb(id);
    }
    return formatCrumb(id);
}


export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((i) => i);

  // Don't show breadcrumbs on the homepage
  if (pathSegments.length === 0) {
    return null;
  }

  return (
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

          // Special handling for dynamic routes
            if (isLast) {
                const prevSegment = pathSegments[index - 1];
                if (['team', 'profile', 'projects', 'my-campaigns'].includes(prevSegment)) {
                    let pageTitle = getNameForId(segment, prevSegment as any);
                    if (pathSegments[index + 1] === 'edit') {
                        // This case is handled by the next segment check
                    } else {
                        return (
                             <React.Fragment key={href}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </React.Fragment>
                        )
                    }
                }
                 if (segment === 'edit' && ['my-campaigns', 'admin/projects'].includes(pathSegments.slice(0, index - 1).join('/'))) {
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbPage>Edit</BreadcrumbPage>
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                }
            }


          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatCrumb(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formatCrumb(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
