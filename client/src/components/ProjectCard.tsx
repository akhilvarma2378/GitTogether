import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { User, Settings } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  owner: { name: string; email: string };
  isOwner: boolean;
}

interface ProjectCardProps {
  project: Project;
  hasApp : boolean
  onApply: (id: number) => Promise<void>; // Update type to Promise
}

export default function ProjectCard({ project, hasApp, onApply }: ProjectCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(hasApp); 
  
  useEffect(() => {
  setHasApplied(hasApp);
}, [hasApp]);

  const handleApplyClick = async () => {
    setLoading(true);
    try {
      await onApply(project.id);
      setHasApplied(true);
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
        {project.isOwner && (
          <span className="bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wide px-2 py-1 rounded-full font-bold">
            Owner
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.requiredSkills.map((skill) => (
          <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-200">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <User size={16} />
          <span className="truncate max-w-[100px]">{project.owner.name}</span>
        </div>
        
        {project.isOwner ? (
          <Button 
            variant="secondary"
            onClick={() => navigate(`/project/${project.id}/manage`, { state: { title: project.title } })}
            className="text-sm py-1.5 flex items-center gap-2"
          >
            <Settings size={14} /> Manage
          </Button>
        ) : (
          <Button 
            onClick={handleApplyClick} 
            disabled={loading || hasApplied}
            className={`text-sm py-1.5 ${hasApplied ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {loading ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
        )}
      </div>
    </div>
  );
}