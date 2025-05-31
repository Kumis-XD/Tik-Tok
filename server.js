const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const compression = require('compression');
// const axiosRetry = require('axios-retry'); // Tambahkan impor ini
const app = express();

const cache = new NodeCache({ stdTTL: 3600 }); // Cache selama 1 jam
const global = { author: 'Padz, Xio (Distributor)' };

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Terapkan retry untuk semua permintaan axios
// axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Fungsi tiktokStalk
async function tiktokStalk(username) {
  const cacheKey = `tiktok_${username}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
    if (!scriptData) throw new Error('User tidak ditemukan');
    const parsedData = JSON.parse(scriptData);
    const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
    if (!userDetail || !userDetail.userInfo) throw new Error('User tidak ditemukan');
    const result = {
      author: global.author,
      status: true,
      data: userDetail.userInfo
    };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    const errorResult = {
      author: global.author,
      status: false,
      message: error.message || 'Terjadi kesalahan'
    };
    cache.set(cacheKey, errorResult, 300);
    return errorResult;
  }
}

// Fungsi instagramStalk
async function instagramStalk(username) {
  const cacheKey = `instagram_${username}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/stalk/instagram?username=${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    const result = {
      author: global.author,
      status: response.data.status,
      data: response.data.data
    };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    const errorResult = {
      author: global.author,
      status: false,
      message: error.message || 'Terjadi kesalahan'
    };
    cache.set(cacheKey, errorResult, 300);
    return errorResult;
  }
}

app.post('/api/tiktok-stalk', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ status: false, message: 'Username diperlukan' });
  }
  const result = await tiktokStalk(username);
  res.json(result);
});

app.post('/api/instagram-stalk', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ status: false, message: 'Username diperlukan' });
  }
  const result = await instagramStalk(username);
  res.json(result);
});

module.exports = app;