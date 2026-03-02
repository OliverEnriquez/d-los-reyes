import { Link } from 'react-router-dom';

const sections = [
  { to: '/logo', label: 'Logo', desc: 'Imagen y texto del logo' },
  { to: '/hero', label: 'Inicio', desc: 'Imagen de fondo, título, descripción y botones' },
  { to: '/about', label: 'Nosotros', desc: 'Texto de la sección About e imagen' },
  { to: '/stats', label: 'Estadísticas', desc: 'Números destacados (años, proyectos, etc.)' },
  { to: '/services', label: 'Servicios', desc: 'Servicios que ofrece la carpintería' },
  { to: '/gallery', label: 'Galería', desc: 'Proyectos con fotos, categoría y título' },
  { to: '/process', label: 'Proceso', desc: 'Pasos del proceso de trabajo' },
  { to: '/testimonials', label: 'Testimonios', desc: 'Opiniones de clientes' },
  { to: '/cta', label: 'CTA Banner', desc: 'Llamado a la acción' },
  { to: '/contact', label: 'Contacto', desc: 'Dirección, teléfono, email, horario' },
  { to: '/footer', label: 'Footer', desc: 'Redes sociales, copyright' },
  { to: '/sections', label: 'Secciones', desc: 'Habilitar o deshabilitar secciones del sitio' },
  { to: '/settings', label: 'Configuración', desc: 'Logo y navegación' },
  { to: '/messages', label: 'Mensajes', desc: 'Mensajes del formulario de contacto' },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(s => (
          <Link key={s.to} to={s.to}
            className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <h3 className="font-semibold mb-1">{s.label}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
