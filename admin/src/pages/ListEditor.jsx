import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import RichEditor from '../components/RichEditor';

export default function ListEditor({ table, title, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/${table}`);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [table]);

  const handleAdd = async () => {
    const newItem = {};
    fields.forEach(f => {
      if (f.type === 'number') newItem[f.key] = 5;
      else if (f.type === 'select') newItem[f.key] = f.options[0].value;
      else newItem[f.key] = '';
    });
    try {
      const { data } = await api.post(`/${table}`, newItem);
      setItems([...items, data]);
      toast.success('Elemento agregado');
      setTimeout(() => {
        const el = document.getElementById(`item-${data.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch {
      toast.error('Error al agregar');
    }
  };

  const handleUpdate = async (id, key, value) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const updated = { ...item, [key]: value };
    setItems(items.map(i => i.id === id ? updated : i));
  };

  const handleSave = async (id) => {
    const item = items.find(i => i.id === id);
    setSavingId(id);
    try {
      await api.put(`/${table}/${id}`, item);
      toast.success('Guardado. Sitio actualizado.');
    } catch {
      toast.error('Error al guardar');
    }
    setSavingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${table}/${id}`);
      setItems(items.filter(i => i.id !== id));
      setConfirmDelete(null);
      toast.success('Elemento eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <button onClick={handleAdd}
        className="fixed bottom-6 right-6 z-40 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition flex items-center gap-2 text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Agregar
      </button>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} id={`item-${item.id}`} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="space-y-3">
              {fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <RichEditor value={item[field.key] || ''} onChange={val => handleUpdate(item.id, field.key, val)} />
                  ) : field.type === 'image' ? (
                    <ImageUploader value={item[field.key]}
                      onChange={val => handleUpdate(item.id, field.key, val)} />
                  ) : field.type === 'select' ? (
                    <select value={item[field.key] || ''}
                      onChange={e => handleUpdate(item.id, field.key, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'number' ? (
                    <input type="number" min="1" max="5" value={item[field.key] || 5}
                      onChange={e => handleUpdate(item.id, field.key, parseInt(e.target.value))}
                      className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  ) : (
                    <input type="text" value={item[field.key] || ''} placeholder={field.placeholder || ''}
                      onChange={e => handleUpdate(item.id, field.key, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button onClick={() => handleSave(item.id)} disabled={savingId === item.id}
                className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 disabled:opacity-50">
                {savingId === item.id ? 'Guardando...' : 'Guardar'}
              </button>
              {confirmDelete === item.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">¿Eliminar?</span>
                  <button onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">
                    Sí, eliminar
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(item.id)}
                  className="bg-red-50 text-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-100">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay elementos. Haz clic en "+ Agregar" para crear uno.</p>
        )}
      </div>
    </div>
  );
}
