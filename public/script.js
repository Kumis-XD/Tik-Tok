// Fungsi untuk menampilkan section tertentu
function showSection(section) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  document.getElementById(section).classList.remove('hidden');
}

// TikTok Logic
document.getElementById('tiktokForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('tiktokUsername').value.replace('@', '');
  const resultDiv = document.getElementById('tiktokResult');
  const userInfoDiv = document.getElementById('tiktokUserInfo');
  const errorDiv = document.getElementById('tiktokError');
  const errorMessage = document.getElementById('tiktokErrorMessage');
  const loadingDiv = document.getElementById('tiktokLoading');

  resultDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch('/api/tiktok-stalk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await response.json();

    loadingDiv.classList.add('hidden');
    if (data.status) {
      const user = data.data;
      userInfoDiv.innerHTML = `
        <div class="flex items-center space-x-4 mb-4">
          <img src="${user.avatarMedium}" alt="Avatar" class="w-16 h-16 rounded-full" loading="lazy">
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-white">${user.nickname} (@${user.uniqueId})</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.signature || 'Tidak ada bio'}</p>
            ${user.verified ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Terverifikasi</span>' : ''}
            ${user.privateAccount ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Akun Privat</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Pengikut</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.fans || 0}</p></div>
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Mengikuti</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.following || 0}</p></div>
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Video</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.videoCount || 0}</p></div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informasi Lanjutan</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><span class="font-medium">SecUid:</span> <input type="text" value="${user.secUid ? user.secUid.substring(0, user.secUid.length / 2) : 'Tidak ada'}" class="w-full bg-gray-100 dark:bg-gray-700 rounded p-1" disabled></li>
          </ul>
        </div>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Author: ${data.author}</p>
      `;
      resultDiv.classList.remove('hidden');
    } else {
      errorMessage.textContent = data.message;
      errorDiv.classList.remove('hidden');
    }
  } catch (error) {
    loadingDiv.classList.add('hidden');
    errorMessage.textContent = 'Terjadi kesalahan saat mengambil data';
    errorDiv.classList.remove('hidden');
  }
});

// Instagram Logic
document.getElementById('instagramForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('instagramUsername').value.replace('@', '');
  const resultDiv = document.getElementById('instagramResult');
  const userInfoDiv = document.getElementById('instagramUserInfo');
  const errorDiv = document.getElementById('instagramError');
  const errorMessage = document.getElementById('instagramErrorMessage');
  const loadingDiv = document.getElementById('instagramLoading');

  resultDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch('/api/instagram-stalk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await response.json();

    loadingDiv.classList.add('hidden');
    if (data.status) {
      const user = data.data;
      const posts = user.posts.slice(0, 3);
      const postsHtml = posts.map(post => `
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">${post.is_video ? 'Video' : 'Foto'}</p>
          <a href="https://www.instagram.com/p/${post.shortcode}" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline">${post.caption ? post.caption.substring(0, 50) + '...' : 'Lihat postingan'}</a>
          <p class="text-sm text-gray-600 dark:text-gray-400">Like: ${post.like_count}, Komentar: ${post.comment_count}</p>
          ${post.is_video ? `<video src="${post.video_url}" poster="${post.thumbnail_url}" controls class="w-full h-auto rounded-md mt-2"></video>` : `<img src="${post.thumbnail_url}" alt="Post" class="w-full h-auto rounded-md mt-2" loading="lazy">`}
        </div>
      `).join('');

      userInfoDiv.innerHTML = `
        <div class="flex items-center space-x-4 mb-4">
          <img src="${user.profile_pic_url}" alt="Avatar" class="w-16 h-16 rounded-full" loading="lazy">
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-white">${user.full_name} (@${user.username})</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.biography || 'Tidak ada bio'}</p>
            ${user.is_verified ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Terverifikasi</span>' : ''}
            ${user.is_private ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Akun Privat</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Pengikut</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.followers_count}</p></div>
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Mengikuti</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.following_count}</p></div>
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Postingan</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.posts_count}</p></div>
          <div><p class="text-sm font-medium text-gray-700 dark:text-gray-300">Akun Bisnis</p><p class="text-lg font-semibold text-gray-800 dark:text-white">${user.is_business_account ? 'Ya' : 'Tidak'}</p></div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informasi Lanjutan</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><span class="font-medium">Link Eksternal:</span> ${user.external_url ? `<a href="${user.external_url}" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline">${user.external_url}</a>` : 'Tidak ada'}</li>
          </ul>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Postingan Terbaru</h3>
          ${postsHtml}
        </div>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Author: ${data.author}</p>
      `;
      resultDiv.classList.remove('hidden');
    } else {
      errorMessage.textContent = data.message;
      errorDiv.classList.remove('hidden');
    }
  } catch (error) {
    loadingDiv.classList.add('hidden');
    errorMessage.textContent = 'Terjadi kesalahan saat mengambil data';
    errorDiv.classList.remove('hidden');
  }
});

// Tampilkan section TikTok secara default
document.addEventListener('DOMContentLoaded', () => {
  showSection('tiktok');
});