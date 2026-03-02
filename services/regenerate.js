const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const db = require('../db/database');

function regenerate() {
  try {
    const data = db.load();

    const templatePath = path.join(__dirname, '..', 'templates', 'index.ejs');
    const outputPath = path.join(__dirname, '..', 'public', 'index.html');

    const html = ejs.renderFile(templatePath, {
      hero: data.content.hero,
      about: data.content.about,
      cta: data.content.cta,
      contact: data.content.contact,
      footer: data.content.footer,
      settings: data.content.settings,
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
        console.error('Error regenerating site:', err.message);
        return;
      }
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log('Site regenerated successfully');
    });
  } catch (err) {
    console.error('Error regenerating site:', err.message);
  }
}

module.exports = { regenerate };
