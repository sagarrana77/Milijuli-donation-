import { ProjectCard } from '@/components/projects/project-card';
import { projects } from '@/lib/data';

export default function ProjectsPage() {
  const sortedProjects = [...projects].sort((a, b) => Number(b.verified) - Number(a.verified));
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
