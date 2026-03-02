import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SectionEditor from './pages/SectionEditor';
import ListEditor from './pages/ListEditor';
import MessagesList from './pages/MessagesList';
import SectionsToggle from './pages/SectionsToggle';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<SectionEditor section="hero" title="Hero / Inicio" fields={[
            { key: 'subtitle', label: 'Subtítulo', type: 'text' },
            { key: 'headline_line1', label: 'Título línea 1', type: 'text' },
            { key: 'headline_line2', label: 'Título línea 2 (cursiva)', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'textarea' },
            { key: 'cta_primary_text', label: 'Botón principal texto', type: 'text' },
            { key: 'cta_primary_link', label: 'Botón principal enlace', type: 'text' },
            { key: 'cta_secondary_text', label: 'Botón secundario texto', type: 'text' },
            { key: 'cta_secondary_link', label: 'Botón secundario enlace', type: 'text' },
            { key: 'background_image', label: 'Imagen de fondo', type: 'image' },
          ]} />} />
          <Route path="about" element={<SectionEditor section="about" title="Nosotros" fields={[
            { key: 'section_label', label: 'Etiqueta sección', type: 'text' },
            { key: 'headline', label: 'Título', type: 'text' },
            { key: 'paragraph1', label: 'Párrafo 1', type: 'textarea' },
            { key: 'paragraph2', label: 'Párrafo 2', type: 'textarea' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'overlay_number', label: 'Número destacado', type: 'text' },
            { key: 'overlay_text', label: 'Texto destacado', type: 'text' },
          ]} />} />
          <Route path="cta" element={<SectionEditor section="cta" title="Llamado a la Acción" fields={[
            { key: 'headline', label: 'Título', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'textarea' },
            { key: 'button_text', label: 'Texto del botón', type: 'text' },
            { key: 'button_link', label: 'Enlace del botón', type: 'text' },
          ]} />} />
          <Route path="contact" element={<SectionEditor section="contact" title="Contacto" fields={[
            { key: 'section_label', label: 'Etiqueta sección', type: 'text' },
            { key: 'headline', label: 'Título', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'textarea' },
            { key: 'address', label: 'Dirección', type: 'text' },
            { key: 'phone', label: 'Teléfono', type: 'text' },
            { key: 'email', label: 'Email', type: 'text' },
            { key: 'hours', label: 'Horario', type: 'text' },
          ]} />} />
          <Route path="footer" element={<SectionEditor section="footer" title="Footer" fields={[
            { key: 'description', label: 'Descripción', type: 'textarea' },
            { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
            { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
            { key: 'social_tiktok', label: 'TikTok URL', type: 'text' },
            { key: 'copyright', label: 'Copyright', type: 'text' },
            { key: 'tagline', label: 'Tagline', type: 'text' },
          ]} />} />
          <Route path="logo" element={<SectionEditor section="settings" title="Logo" fields={[
            { key: 'logo_text', label: 'Texto del logo', type: 'text' },
            { key: 'logo_image', label: 'Imagen del logo', type: 'image' },
          ]} />} />
          <Route path="settings" element={<SectionEditor section="settings" title="Configuración General" fields={[
            { key: 'logo_text', label: 'Texto del logo', type: 'text' },
            { key: 'logo_image', label: 'Imagen del logo', type: 'image' },
          ]} />} />
          <Route path="stats" element={<ListEditor table="stats" title="Estadísticas" fields={[
            { key: 'number', label: 'Número', type: 'text', placeholder: 'Ej: 15+' },
            { key: 'label', label: 'Etiqueta', type: 'text', placeholder: 'Ej: Años de experiencia' },
          ]} />} />
          <Route path="services" element={<ListEditor table="services" title="Servicios" fields={[
            { key: 'title', label: 'Título', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'textarea' },
            { key: 'icon', label: 'Icono', type: 'select', options: [
              { value: 'home', label: 'Casa' },
              { value: 'building', label: 'Edificio' },
              { value: 'puzzle', label: 'Puzzle' },
            ]},
          ]} />} />
          <Route path="gallery" element={<ListEditor table="gallery" title="Galería" fields={[
            { key: 'title', label: 'Título', type: 'text' },
            { key: 'category', label: 'Categoría', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
          ]} />} />
          <Route path="process" element={<ListEditor table="process" title="Proceso" fields={[
            { key: 'step_number', label: 'Número', type: 'text', placeholder: 'Ej: 01' },
            { key: 'title', label: 'Título', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'textarea' },
          ]} />} />
          <Route path="testimonials" element={<ListEditor table="testimonials" title="Testimonios" fields={[
            { key: 'quote', label: 'Testimonio', type: 'textarea' },
            { key: 'author', label: 'Autor', type: 'text' },
            { key: 'context', label: 'Contexto', type: 'text', placeholder: 'Ej: Proyecto residencial' },
            { key: 'rating', label: 'Estrellas (1-5)', type: 'number' },
          ]} />} />
          <Route path="sections" element={<SectionsToggle />} />
          <Route path="messages" element={<MessagesList />} />
        </Route>
      </Routes>
    </>
  );
}
