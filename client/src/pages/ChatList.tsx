import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    api.get('/chats').then(({ data }) => setChats(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Conversations</h1>
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link 
            key={chat.id} 
            to={`/chat/${chat.project.id}`}
            className="block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors group"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                  {chat.project.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  with {chat.members.map((m: any) => m.name).join(', ')}
                </p>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-blue-500" />
            </div>
          </Link>
        ))}
        {chats.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No active chats yet.</p>
            <p className="text-sm text-gray-400">Apply to projects or accept applicants to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
}