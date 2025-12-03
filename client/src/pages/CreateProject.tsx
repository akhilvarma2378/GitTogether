import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    capacity: '2'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/projects', { ...formData, requiredSkills: skillsArray });
      navigate('/dashboard');
    } catch (error) {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Post a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Project Title" 
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea 
            className="border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <Input 
          label="Required Skills (comma separated)" 
          placeholder="e.g. React, TypeScript, Postgres"
          value={formData.requiredSkills}
          onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
          required
        />

        <Input 
          label="Team Capacity" 
          type="number"
          min="1"
          value={formData.capacity}
          onChange={e => setFormData({...formData, capacity: e.target.value})}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Posting...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
}