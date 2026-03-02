import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/logo', label: 'Logo' },
  { to: '/hero', label: 'Hero / Inicio' },
  { to: '/about', label: 'Nosotros' },
  { to: '/stats', label: 'Estadísticas' },
  { to: '/services', label: 'Servicios' },
  { to: '/gallery', label: 'Galería' },
  { to: '/process', label: 'Proceso' },
  { to: '/testimonials', label: 'Testimonios' },
  { to: '/cta', label: 'CTA Banner' },
  { to: '/contact', label: 'Contacto' },
  { to: '/footer', label: 'Footer' },
  { to: '/sections', label: 'Secciones' },
  { to: '/settings', label: 'Configuración' },
  { to: '/messages', label: 'Mensajes' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentLabel = links.find(l => l.to === location.pathname)?.label || 'Admin';

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-60
      `}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">D' Los Reyes</h2>
            <p className="text-xs text-white/50">CMS Admin</p>
          </div>
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
              }>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" target="_blank" className="block text-xs text-white/40 hover:text-white mb-2">Ver sitio</a>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-sm truncate">{currentLabel}</span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
