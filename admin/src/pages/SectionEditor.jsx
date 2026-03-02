import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import RichEditor from '../components/RichEditor';

export default function SectionEditor({ section, title, fields }) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/content/${section}`).then(res => setData(res.data.data));
  }, [section]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/content/${section}`, data);
      toast.success('Guardado. Sitio actualizado.');
    } catch {
      toast.error('Error al guardar');
    }
    setSaving(false);
  };

  if (!data) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={handleSave} disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <RichEditor key={section + '-' + field.key} value={data[field.key] || ''} onChange={val => setData({ ...data, [field.key]: val })} />
            ) : field.type === 'image' ? (
              <ImageUploader value={data[field.key]} onChange={val => setData({ ...data, [field.key]: val })} />
            ) : (
              <input type="text" value={data[field.key] || ''}
                onChange={e => setData({ ...data, [field.key]: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
