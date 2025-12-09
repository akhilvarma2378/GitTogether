import { useEffect, useState } from 'react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [appliedProjectIds, setAppliedProjectIds] = useState<number[]>([]);


  const fetchProjects = async (skills = '') => {
    try {
      const url = skills ? `/projects?skills=${skills}` : '/projects';
      const { data } = await api.get(url);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

const handleApply = async (projectId: number) => {
  try {
    await api.post(`/applications/project/${projectId}`);
    setAppliedProjectIds((prev) => [...prev, projectId]);
  } catch (error: any) {
    alert(error.response?.data?.message || "Failed to apply");
    throw error;
  }
};

  return (
    <div className="space-y-8">
      {/* Search Header - Same as before */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Find a Project</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter by skills (e.g. React, Node)..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <button 
            onClick={() => fetchProjects(skillFilter)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (         
          <ProjectCard 
            key={p.id} 
            project={{...p, isOwner: p.ownerId === user?.id}}
            hasApp = {appliedProjectIds.includes(p.id)}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
}