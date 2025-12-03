import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { LogOut, MessageSquare, PlusCircle } from 'lucide-react'; // Ensure lucide-react is installed

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Don't show navbar if not logged in

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          GitTogether 🤝
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/create-project" className="text-gray-600 hover:text-black flex items-center gap-1">
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Post Project</span>
          </Link>
          
          <Link to="/chats" className="text-gray-600 hover:text-black flex items-center gap-1">
            <MessageSquare size={20} />
            <span className="hidden sm:inline">Messages</span>
          </Link>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <span className="font-medium text-sm hidden sm:block">{user.name}</span>
          
          <Button variant="secondary" onClick={logout} className="text-sm px-3 py-1">
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </nav>
  );
}