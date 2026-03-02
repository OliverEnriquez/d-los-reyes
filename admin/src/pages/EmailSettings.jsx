import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function EmailSettings() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/content/settings').then(res => {
      setSettings(res.data.data);
      setEmails(res.data.data.notification_emails || []);
    });
  }, []);

  const addEmail = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return toast.error('Ingresa un email válido');
    if (emails.includes(email)) return toast.error('Este email ya está agregado');
    setEmails([...emails, email]);
    setNewEmail('');
  };

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/content/settings', { ...settings, notification_emails: emails });
      toast.success('Correos guardados');
    } catch {
      toast.error('Error al guardar');
    }
    setSaving(false);
  };

  if (!settings) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Correos de Notificación</h1>
        <button onClick={handleSave} disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-gray-500 mb-4">
          Cuando alguien envíe un mensaje desde el formulario de contacto, se enviará una notificación a estos correos.
        </p>

        <div className="space-y-3 mb-6">
          {emails.map((email, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded px-4 py-3">
              <span className="flex-1 text-sm">{email}</span>
              <button onClick={() => removeEmail(i)}
                className="text-red-500 hover:text-red-700 text-sm font-medium">
                Eliminar
              </button>
            </div>
          ))}
          {emails.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No hay correos configurados</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
            placeholder="correo@ejemplo.com"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button onClick={addEmail}
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 whitespace-nowrap">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
