const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const global = { author: 'Padz, Xio (Distributor)' };

async function tiktokStalk(username) {
  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0' } // Tambahkan header untuk menghindari blokir
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
    if (!scriptData) throw new Error('User tidak ditemukan');
    const parsedData = JSON.parse(scriptData);
    const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
    if (!userDetail || !userDetail.userInfo) throw new Error('User tidak ditemukan');
    return {
      author: global.author,
      status: true,
      data: userDetail.userInfo
    };
  } catch (error) {
    return {
      author: global.author,
      status: false,
      message: error.message || 'Terjadi kesalahan'
    };
  }
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/api/tiktok-stalk', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ status: false, message: 'Username diperlukan' });
  }
  const result = await tiktokStalk(username);
  res.json(result);
});

module.exports = app; // Ekspor aplikasi untuk Vercel