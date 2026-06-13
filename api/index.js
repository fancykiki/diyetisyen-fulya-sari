const express = require('express');
const path = require('path');

const app = express();
const root = path.resolve(__dirname, '..');

app.set('view engine', 'ejs');
app.set('views', path.join(root, 'views'));

app.use(express.static(path.join(root, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require(path.join(root, 'routes/pages')));

app.use((req, res) => {
  const siteData = require(path.join(root, 'data/site-data.json'));
  res.status(404).render('404', {
    site: siteData.site,
    path: req.path,
    meta: { title: 'Sayfa Bulunamadı' }
  });
});

module.exports = app;
