const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const db = require('../db/database');

const defaults = {
  hero: { subtitle: '', headline_line1: '', headline_line2: '', description: '', cta_primary_text: '', cta_primary_link: '#', cta_secondary_text: '', cta_secondary_link: '#', background_image: '' },
  about: { section_label: '', headline: '', paragraph1: '', paragraph2: '', benefits: [], image: '', overlay_number: '', overlay_text: '' },
  cta: { headline: '', description: '', button_text: '', button_link: '#' },
  contact: { section_label: '', headline: '', description: '', address: '', phone: '', email: '', hours: '', form_options: [] },
  footer: { description: '', social_facebook: '#', social_instagram: '#', social_tiktok: '#', copyright: '', tagline: '' },
  settings: { logo_text: '', logo_image: '', nav_items: [] }
};

function regenerate() {
  try {
    const data = db.load();

    const templatePath = path.join(__dirname, '..', 'templates', 'index.ejs');
    const outputPath = path.join(__dirname, '..', 'public', 'index.html');

    ejs.renderFile(templatePath, {
      hero: { ...defaults.hero, ...data.content.hero },
      about: { ...defaults.about, ...data.content.about },
      cta: { ...defaults.cta, ...data.content.cta },
      contact: { ...defaults.contact, ...data.content.contact },
      footer: { ...defaults.footer, ...data.content.footer },
      settings: { ...defaults.settings, ...data.content.settings },
      services_header: data.content.services_header || { section_label: 'Nuestros servicios', headline: 'Lo que hacemos' },
      gallery_header: data.content.gallery_header || { section_label: 'Nuestro trabajo', headline: 'Galería de Proyectos' },
      process_header: data.content.process_header || { section_label: 'Cómo trabajamos', headline: 'Nuestro Proceso' },
      testimonials_header: data.content.testimonials_header || { section_label: 'Testimonios', headline: 'Lo que dicen nuestros clientes' },
      stats: (data.stats || []).sort((a, b) => a.sort_order - b.sort_order),
      services: (data.services || []).sort((a, b) => a.sort_order - b.sort_order),
      gallery: (data.gallery || []).sort((a, b) => a.sort_order - b.sort_order),
      process_steps: (data.process_steps || []).sort((a, b) => a.sort_order - b.sort_order),
      testimonials: (data.testimonials || []).sort((a, b) => a.sort_order - b.sort_order)
    }, (err, html) => {
      if (err) {
        console.error('[REGENERATE ERROR]', err.message);
        console.error(err.stack);
        return;
      }
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log('Site regenerated successfully');
    });
  } catch (err) {
    console.error('[REGENERATE ERROR]', err.message);
    console.error(err.stack);
  }
}

module.exports = { regenerate };
