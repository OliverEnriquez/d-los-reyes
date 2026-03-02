import { useState, useEffect, useRef } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import RichEditor from '../components/RichEditor';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ item, index, total, fields, table, handleUpdate, handleSave, handleDelete, savingId, confirmDelete, setConfirmDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} id={`item-${item.id}`}
      className={`bg-white rounded-lg shadow-sm p-5 border ${isDragging ? 'border-black shadow-lg' : 'border-gray-100'}`}>
      {/* Drag handle */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <span className="text-xs text-gray-400 font-medium">#{index + 1} de {total}</span>
        <button {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition touch-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <RichEditor key={table + '-' + item.id + '-' + field.key} value={item[field.key] || ''} onChange={val => handleUpdate(item.id, field.key, val)} />
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
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
        <button onClick={() => handleSave(item.id)} disabled={savingId === item.id}
          className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 disabled:opacity-50">
          {savingId === item.id ? 'Guardando...' : 'Guardar'}
        </button>
        {confirmDelete === item.id ? (
          <div className="flex items-center gap-2">
            <button onClick={() => handleDelete(item.id)}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">
              Sí
            </button>
            <button onClick={() => setConfirmDelete(null)}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
              No
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(item.id)}
            className="text-red-400 px-2 py-1.5 rounded text-sm hover:text-red-600 hover:bg-red-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function ListEditor({ table, title, fields, headerSection, headerFields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [savingHeader, setSavingHeader] = useState(false);
  const itemsRef = useRef(items);

  useEffect(() => { itemsRef.current = items; }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const load = async () => {
    try {
      const { data } = await api.get(`/${table}`);
      setItems(data);
      if (headerSection) {
        try {
          const hRes = await api.get(`/content/${headerSection}`);
          setHeaderData(hRes.data.data);
        } catch { /* header section not yet in DB */ }
      }
    } catch { }
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
      setItems(prev => [...prev, data]);
      toast.success('Elemento agregado');
      setTimeout(() => {
        const el = document.getElementById(`item-${data.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch {
      toast.error('Error al agregar');
    }
  };

  const handleUpdate = (id, key, value) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i));
  };

  const isItemComplete = (item) => {
    return fields.every(f => {
      const val = item[f.key];
      if (f.type === 'number') return val !== undefined && val !== null;
      if (f.type === 'select') return true;
      return val && val.trim && val.trim() !== '';
    });
  };

  const handleSave = async (id) => {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    if (!isItemComplete(item)) {
      toast.error('Completa todos los campos antes de guardar');
      return;
    }
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
      setItems(prev => prev.filter(i => i.id !== id));
      setConfirmDelete(null);
      toast.success('Elemento eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex).map((item, i) => ({ ...item, sort_order: i }));
    setItems(newItems);

    try {
      for (const item of newItems) {
        await api.put(`/${table}/${item.id}`, item);
      }
      toast.success('Orden actualizado');
    } catch {
      toast.error('Error al reordenar');
    }
  };

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
      await api.put(`/content/${headerSection}`, headerData);
      toast.success('Título actualizado');
    } catch {
      toast.error('Error al guardar título');
    }
    setSavingHeader(false);
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {headerData && headerFields && (
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
          <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Título de sección</p>
          <div className="space-y-3">
            {headerFields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                <input type="text" value={headerData[f.key] || ''} placeholder={f.placeholder || ''}
                  onChange={e => setHeaderData({ ...headerData, [f.key]: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            ))}
          </div>
          <button onClick={handleSaveHeader} disabled={savingHeader}
            className="mt-3 bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 disabled:opacity-50">
            {savingHeader ? 'Guardando...' : 'Guardar título'}
          </button>
        </div>
      )}
      <button onClick={handleAdd}
        className="fixed bottom-6 right-6 z-40 bg-black text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-800 transition flex items-center justify-center text-2xl font-bold">
        +
      </button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                fields={fields}
                table={table}
                handleUpdate={handleUpdate}
                handleSave={handleSave}
                handleDelete={handleDelete}
                savingId={savingId}
                confirmDelete={confirmDelete}
                setConfirmDelete={setConfirmDelete}
              />
            ))}
            {items.length === 0 && (
              <p className="text-gray-400 text-center py-8">No hay elementos. Haz clic en "+ Agregar" para crear uno.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
