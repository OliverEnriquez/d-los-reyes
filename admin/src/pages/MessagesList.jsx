import { useState, useEffect } from 'react';
import api from '../api';

export default function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages').then(res => { setMessages(res.data); setLoading(false); });
  }, []);

  const markRead = async (id) => {
    await api.put(`/messages/${id}/read`);
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mensajes ({messages.filter(m => !m.read).length} sin leer)</h1>
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`bg-white rounded-lg shadow-sm p-5 border ${msg.read ? 'border-gray-100' : 'border-black'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{msg.name}</p>
                <p className="text-sm text-gray-500">{msg.email} {msg.phone && `| ${msg.phone}`}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString('es-MX')}</p>
                {msg.project_type && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{msg.project_type}</span>}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{msg.message}</p>
            {!msg.read && (
              <button onClick={() => markRead(msg.id)}
                className="text-xs text-black underline hover:no-underline">
                Marcar como leído
              </button>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay mensajes todavía.</p>
        )}
      </div>
    </div>
  );
}
