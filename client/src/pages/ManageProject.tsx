import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, User, MessageSquare } from 'lucide-react';

export default function ManageProject() {
  const { projectId } = useParams();
  const { state } = useLocation(); // We will pass project Title via router state
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Applicants
  const fetchApplicants = async () => {
    try {
      const { data } = await api.get(`/applications/project/${projectId}`);
      setApplicants(data);
    } catch (error) {
      console.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [projectId]);

  // Handle Accept/Reject
  const handleStatusUpdate = async (appId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      // Refresh list to show new status
      fetchApplicants();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage: {state?.title || `Project #${projectId}`}
        </h1>
        <p className="text-gray-500">Review and select your partners.</p>
      </div>

      <div className="grid gap-4">
        {loading ? <p>Loading applicants...</p> : null}
        
        {!loading && applicants.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
            No applications yet.
          </div>
        )}

        {applicants.map((app) => (
          <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Applicant Details */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User size={18} className="text-gray-400" />
                <h3 className="font-bold text-lg">{app.user.name}</h3>
                <span className="text-xs text-gray-400">({app.user.email})</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {app.user.skills.map((skill: string) => (
                  <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              
              {app.user.bio && <p className="text-sm text-gray-600 italic">"{app.user.bio}"</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {app.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-medium transition"
                  >
                    <CheckCircle size={18} /> Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                    className="flex items-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium transition"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}

              {app.status === 'ACCEPTED' && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle size={16} /> Accepted
                  </span>
                  <span className="text-xs text-gray-400">Chat group created</span>
                </div>
              )}

              {app.status === 'REJECTED' && (
                <span className="text-red-400 font-medium flex items-center gap-1">
                  <XCircle size={16} /> Rejected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}