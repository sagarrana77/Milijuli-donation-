
import { ProjectCard } from '@/components/projects/project-card';
import { projects } from '@/lib/data';

export default function ProjectsPage() {
  const approvedProjects = projects.filter(p => p.verified);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {approvedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
