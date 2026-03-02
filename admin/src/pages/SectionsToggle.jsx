import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const sections = [
  { key: 'show_stats', label: 'Estadísticas', desc: 'Barra de números debajo del hero' },
  { key: 'show_about', label: 'Nosotros', desc: 'Sección sobre la empresa' },
  { key: 'show_services', label: 'Servicios', desc: 'Lista de servicios ofrecidos' },
  { key: 'show_gallery', label: 'Galería', desc: 'Galería de proyectos' },
  { key: 'show_process', label: 'Proceso', desc: 'Pasos del proceso de trabajo' },
  { key: 'show_testimonials', label: 'Testimonios', desc: 'Opiniones de clientes' },
  { key: 'show_cta', label: 'CTA Banner', desc: 'Llamado a la acción' },
  { key: 'show_contact', label: 'Contacto', desc: 'Formulario y datos de contacto' },
];

export default function SectionsToggle() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/content/settings').then(res => setData(res.data.data));
  }, []);

  const toggle = (key) => {
    setData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/content/settings', data);
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
        <h1 className="text-2xl font-bold">Secciones del sitio</h1>
        <button onClick={handleSave} disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
        {sections.map(section => (
          <div key={section.key} className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium text-sm">{section.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{section.desc}</p>
            </div>
            <button onClick={() => toggle(section.key)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${data[section.key] !== false ? 'bg-black' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${data[section.key] !== false ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Las secciones deshabilitadas no se mostrarán en el sitio público.
      </p>
    </div>
  );
}
