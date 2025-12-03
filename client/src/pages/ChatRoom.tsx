import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

export default function ChatRoom() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace('/api', '');

useEffect(() => {
  const newSocket = io(SOCKET_URL, {
    auth: { token: localStorage.getItem('token') },
    transports: ['websocket', 'polling']
  });

    newSocket.on('connect', () => {
      console.log("Connected to socket");
      newSocket.emit('join_room', projectId);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    // Fetch previous history
    api.get(`/chats/${projectId}/messages`).then(({ data }) => {
      setMessages(data);
    });

    return () => { newSocket.disconnect(); };
  }, [projectId]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    // Optimistic UI update (optional, but we'll rely on socket 'receive_message' for simplicity)
    socket.emit('send_message', { projectId, content: input });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <h2 className="font-bold text-gray-800">Project Chat Room</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg, idx) => {
          const isMe = msg.sender.id === user?.id;
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                {!isMe && <p className="text-xs text-gray-500 mb-1 font-bold">{msg.sender.name}</p>}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}