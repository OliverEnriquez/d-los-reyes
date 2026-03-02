import { useState, useRef } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const { data } = await api.post('/upload', form);
      onChange(data.url);
      toast.success('Imagen subida');
    } catch {
      toast.error('Error al subir imagen');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="Preview" className="w-full max-w-xs h-40 object-cover rounded border" />
      )}
      <div className="flex gap-2 items-center">
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="URL de imagen o sube una" />
        <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
        <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap">
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
    </div>
  );
}
