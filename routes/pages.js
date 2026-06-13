const express = require('express');
const router = express.Router();
const siteData = require('../data/site-data.json');
const makaleler = require('../data/makaleler.json');

function mergeData(extra = {}) {
  const { path, meta, ...rest } = extra;
  return { ...siteData, makaleler, path: path || '/', meta: meta || {}, ...rest };
}

router.get('/', (req, res) => {
  const data = mergeData({ path: '/' });
  data.recentMakaleler = makaleler.slice(0, 3);
  data.success = req.query.success === 'true';
  data.error = req.query.error || null;
  res.render('index', data);
});

router.get('/hakkimizda', (req, res) => {
  res.render('about', mergeData({
    path: '/hakkimizda',
    meta: { title: 'Hakkımızda', desc: 'Antalya'da sağlıklı beslenme ve kilo yönetimi danışmanlığı sunan bir diyetisyen' }
  }));
});

router.get('/hizmetler', (req, res) => {
  res.render('services', mergeData({
    path: '/hizmetler',
    meta: { title: 'Hizmetlerimiz', desc: 'Profesyonel beslenme ve diyet danışmanlığı hizmetlerimiz. Nöroendokrin beslenme, duygusal yeme danışmanlığı, kilo yönetimi ve daha fazlası için premium çözümler.' }
  }));
});

router.get('/hizmetler/:slug', (req, res) => {
  const service = siteData.services.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).render('404', mergeData({ path: req.path }));
  const relatedServices = siteData.services.filter(s => s.slug !== service.slug).slice(0, 3);
  res.render('service-detail', mergeData({
    path: '/hizmetler/' + service.slug,
    meta: {
      title: service.metaTitle || service.title,
      desc: service.metaDescription || service.shortDescription,
      image: service.detailImage || service.image,
      type: 'article'
    },
    service,
    relatedServices
  }));
});

router.get('/makaleler', (req, res) => {
  const kategori = req.query.kategori;
  let filtrelenmis = makaleler;
  if (kategori) {
    filtrelenmis = makaleler.filter(m => m.category.toLowerCase() === kategori.toLowerCase());
  }
  const kategoriler = [...new Set(makaleler.map(m => m.category))];
  res.render('makaleler', mergeData({
    path: '/makaleler',
    meta: { title: 'Beslenme Makaleleri', desc: 'Sağlıklı beslenme, diyet, kilo yönetimi ve beslenme bilimi hakkında uzman diyetisyen makaleleri.' },
    filtrelenmis,
    kategoriler,
    aktifKategori: kategori
  }));
});

router.get('/makale/:slug', (req, res) => {
  const makale = makaleler.find(m => m.slug === req.params.slug);
  if (!makale) return res.status(404).render('404', mergeData({ path: req.path }));
  const ilgiliMakaleler = makaleler
    .filter(m => m.slug !== makale.slug && m.category === makale.category)
    .slice(0, 2);
  res.render('makale', mergeData({
    path: '/makale/' + makale.slug,
    meta: {
      title: makale.title,
      desc: makale.metaDesc,
      image: makale.image,
      type: 'article',
      author: makale.author,
      date: makale.date,
      category: makale.category
    },
    makale,
    ilgiliMakaleler
  }));
});

router.get('/iletisim', (req, res) => {
  res.render('contact', mergeData({
    path: '/iletisim',
    meta: { title: 'İletişim', desc: 'Antalya Diyetisyen iletişim bilgileri. Randevu ve bilgi için bizi arayın veya formu doldurun.' },
    success: req.query.success === 'true',
    error: req.query.error || null
  }));
});

router.post('/iletisim', (req, res) => {
  const { name, email, phone, message, service } = req.body;

  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Adınız en az 2 karakter olmalıdır.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Geçerli bir e-posta adresi giriniz.');
  if (phone && !/^[0-9\s\+\-\(\)]{7,20}$/.test(phone)) errors.push('Geçerli bir telefon numarası giriniz.');
  if (message && message.length > 2000) errors.push('Mesajınız çok uzun (max 2000 karakter).');

  if (errors.length > 0) {
    return res.redirect('/iletisim?error=' + encodeURIComponent(errors[0]));
  }

  console.log('Yeni iletişim formu:', { name, email, phone, service, message });
  res.redirect('/?success=true');
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    'User-agent: *\nAllow: /\nSitemap: https://www.antalyadiyetisyen.com/sitemap.xml\n'
  );
});

router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.antalyadiyetisyen.com';
  const pages = ['/', '/hakkimizda', '/hizmetler', '/makaleler', '/iletisim'];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  pages.forEach(p => {
    xml += `  <url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>\n`;
  });
  siteData.services.forEach(s => {
    xml += `  <url><loc>${baseUrl}/hizmetler/${s.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  });
  makaleler.forEach(m => {
    xml += `  <url><loc>${baseUrl}/makale/${m.slug}</loc><lastmod>${m.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  });
  xml += '</urlset>';
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;
