const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes/pages'));

app.use((req, res) => {
  const siteData = require('./data/site-data.json');
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).render('404', {
    site: siteData.site,
    path: req.path,
    meta: { title: 'Sayfa Bulunamadı' }
  });
});

app.listen(PORT, () => {
  console.log(`Site çalışıyor: http://localhost:${PORT}`);
});
