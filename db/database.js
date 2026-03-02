const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

function getDefaultData() {
  return {
    content: {
      hero: {
        subtitle: 'Carpintería & Diseño de Autor',
        headline_line1: 'Muebles con',
        headline_line2: 'carácter propio',
        description: 'Creamos piezas únicas que transforman espacios. Diseño contemporáneo, materiales nobles y artesanía de excelencia.',
        cta_primary_text: 'Ver Proyectos',
        cta_primary_link: '#galeria',
        cta_secondary_text: 'Cotizar',
        cta_secondary_link: '#contacto',
        background_image: 'https://images.unsplash.com/photo-1746043379042-32e843d98cf2?w=1600&q=80'
      },
      about: {
        section_label: 'Sobre nosotros',
        headline: 'La madera cobra vida en nuestras manos',
        paragraph1: 'En <strong class="text-black">D\' Los Reyes</strong> fusionamos la tradición artesanal con el diseño contemporáneo. Cada mueble que creamos es una pieza única, diseñada para adaptarse perfectamente a tu espacio y estilo de vida.',
        paragraph2: 'Trabajamos con maderas selectas y materiales de primera calidad, aplicando técnicas que combinan lo mejor de la carpintería clásica con la precisión moderna. Nuestro equipo de diseñadores y maestros carpinteros garantiza un resultado excepcional.',
        benefits: [
          { icon: 'check', label: 'Calidad Premium' },
          { icon: 'clock', label: 'Entrega Puntual' },
          { icon: 'heart', label: 'Pasión Artesanal' }
        ],
        image: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?w=800&q=80',
        overlay_number: '15',
        overlay_text: 'Años creando arte en madera'
      },
      cta: {
        headline: '¿Tienes un proyecto en mente?',
        description: 'Hagamos realidad tu visión. Agenda una consulta gratuita y comencemos a diseñar juntos.',
        button_text: 'Agendar Consulta',
        button_link: '#contacto'
      },
      contact: {
        section_label: 'Contacto',
        headline: 'Hablemos de tu proyecto',
        description: 'Estamos listos para escucharte. Cuéntanos qué tienes en mente y te ayudaremos a hacerlo realidad con la mejor calidad y diseño.',
        address: 'Av. Reforma 245, Col. Centro, CDMX',
        phone: '+52 (55) 1234 5678',
        email: 'info@dlosreyes.com',
        hours: 'Lun - Vie: 9:00 - 18:00 | Sáb: 9:00 - 14:00',
        form_options: ['Cocina integral', 'Closet / Vestidor', 'Mueble de sala', 'Comedor', 'Oficina / Escritorio', 'Mueble comercial', 'Otro']
      },
      footer: {
        description: 'Carpintería de autor especializada en la creación de muebles con diseño único. Transformamos espacios con piezas que combinan funcionalidad, estética y la calidez natural de la madera.',
        social_facebook: '#',
        social_instagram: '#',
        social_tiktok: '#',
        copyright: '2026 D\' Los Reyes Carpintería & Diseño. Todos los derechos reservados.',
        tagline: 'Diseñado con pasión por la madera'
      },
      services_header: {
        section_label: 'Nuestros servicios',
        headline: 'Lo que hacemos'
      },
      gallery_header: {
        section_label: 'Nuestro trabajo',
        headline: 'Galería de Proyectos'
      },
      process_header: {
        section_label: 'Cómo trabajamos',
        headline: 'Nuestro Proceso'
      },
      testimonials_header: {
        section_label: 'Testimonios',
        headline: 'Lo que dicen nuestros clientes'
      },
      settings: {
        logo_text: 'D\' Los Reyes',
        logo_image: '',
        notification_emails: ['ariany.enri@gmail.com', 'odec12@gmail.com'],
        show_stats: true,
        show_about: true,
        show_services: true,
        show_gallery: true,
        show_process: true,
        show_testimonials: true,
        show_cta: true,
        show_contact: true,
        nav_items: [
          { label: 'Inicio', href: '#inicio' },
          { label: 'Nosotros', href: '#nosotros' },
          { label: 'Servicios', href: '#servicios' },
          { label: 'Galería', href: '#galeria' },
          { label: 'Proceso', href: '#proceso' },
          { label: 'Contacto', href: '#contacto' }
        ]
      }
    },
    stats: [
      { id: 1, sort_order: 0, number: '15+', label: 'Años de experiencia' },
      { id: 2, sort_order: 1, number: '500+', label: 'Proyectos realizados' },
      { id: 3, sort_order: 2, number: '100%', label: 'Hecho a medida' },
      { id: 4, sort_order: 3, number: '50+', label: 'Diseños exclusivos' }
    ],
    services: [
      { id: 1, sort_order: 0, icon: 'home', title: 'Mobiliario Residencial', description: 'Cocinas integrales, closets, libreros, mesas de comedor, centros de entretenimiento y todo tipo de muebles para tu hogar, diseñados a tu medida.' },
      { id: 2, sort_order: 1, icon: 'building', title: 'Mobiliario Comercial', description: 'Diseño y fabricación de muebles para oficinas, restaurantes, boutiques y espacios comerciales que reflejan la identidad de tu marca.' },
      { id: 3, sort_order: 2, icon: 'puzzle', title: 'Diseño Personalizado', description: 'Piezas únicas de autor. Trabajamos contigo desde el concepto hasta la instalación, creando muebles que son verdaderas obras de arte funcional.' }
    ],
    gallery: [
      { id: 1, sort_order: 0, image: 'https://images.unsplash.com/photo-1520809520607-9dfb3b35ee7a?w=900&q=80', category: 'Puertas', title: 'Puerta de Madera' },
      { id: 2, sort_order: 1, image: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?w=600&q=80', category: 'Taller', title: 'Trabajo Artesanal' },
      { id: 3, sort_order: 2, image: 'https://images.unsplash.com/photo-1746043379042-32e843d98cf2?w=600&q=80', category: 'Escaleras', title: 'Escaleras de Madera' },
      { id: 4, sort_order: 3, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80', category: 'Oficina', title: 'Escritorio de Madera' },
      { id: 5, sort_order: 4, image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80', category: 'Estudio', title: 'Repisas Flotantes' },
      { id: 6, sort_order: 5, image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80', category: 'A medida', title: 'Mueble a Medida' }
    ],
    process_steps: [
      { id: 1, sort_order: 0, step_number: '01', title: 'Consulta', description: 'Escuchamos tus ideas, necesidades y visitamos el espacio para tomar medidas exactas.' },
      { id: 2, sort_order: 1, step_number: '02', title: 'Diseño', description: 'Creamos propuestas de diseño con renders 3D para que visualices el resultado final.' },
      { id: 3, sort_order: 2, step_number: '03', title: 'Fabricación', description: 'Nuestros maestros carpinteros dan vida a tu proyecto con los mejores materiales.' },
      { id: 4, sort_order: 3, step_number: '04', title: 'Instalación', description: 'Entregamos e instalamos tu mueble, asegurándonos de tu total satisfacción.' }
    ],
    testimonials: [
      { id: 1, sort_order: 0, quote: 'Nuestra cocina integral quedó espectacular. El equipo de D\' Los Reyes entendió exactamente lo que buscábamos y el resultado superó nuestras expectativas.', author: 'María González', context: 'Proyecto residencial', rating: 5 },
      { id: 2, sort_order: 1, quote: 'Amueblamos todo nuestro restaurante con D\' Los Reyes. La calidad de los acabados y la atención al detalle son incomparables. Totalmente recomendados.', author: 'Carlos Mendoza', context: 'Restaurante Raíces', rating: 5 },
      { id: 3, sort_order: 2, quote: 'El escritorio y librero que diseñaron para mi oficina son perfectos. Funcionales, elegantes y hechos con una calidad increíble. Arte puro.', author: 'Ana Lucía Torres', context: 'Home office', rating: 5 }
    ],
    messages: [],
    _nextIds: { stats: 5, services: 4, gallery: 7, process_steps: 5, testimonials: 4, messages: 1 }
  };
}

function load() {
  if (!fs.existsSync(DB_PATH)) {
    const data = getDefaultData();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getNextId(data, table) {
  const id = data._nextIds[table];
  data._nextIds[table] = id + 1;
  return id;
}

module.exports = { load, save, getNextId };
