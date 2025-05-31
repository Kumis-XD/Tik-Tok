document.getElementById('stalkForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.replace('@', '');
  const resultDiv = document.getElementById('result');
  const userInfoDiv = document.getElementById('userInfo');
  const errorDiv = document.getElementById('error');
  const errorMessage = document.getElementById('errorMessage');
  const loadingDiv = document.getElementById('loading');

  // Reset tampilan
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

    // Sembunyikan loading
    loadingDiv.classList.add('hidden');

    if (data.status) {
      const user = data.data.user;
      const stats = data.data.stats;

      // Konversi createTime ke tanggal yang mudah dibaca
      const createDate = new Date(user.createTime * 1000).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Potong secUid menjadi setengah panjangnya
      const halfSecUid = user.secUid.slice(0, Math.floor(user.secUid.length / 2)) + '...';

      userInfoDiv.innerHTML = `
        <div class="flex items-center space-x-4 mb-4">
          <img src="${user.avatarMedium}" alt="Avatar" class="w-16 h-16 rounded-full">
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-white">${user.nickname} (@${user.uniqueId})</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.signature || 'Tidak ada bio'}</p>
            ${user.verified ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Terverifikasi</span>' : ''}
            ${user.privateAccount ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Akun Privat</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Pengikut</p>
            <p class="text-lg font-semibold text-gray-800 dark:text-white">${stats.followerCount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Mengikuti</p>
            <p class="text-lg font-semibold text-gray-800 dark:text-white">${stats.followingCount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Suka</p>
            <p class="text-lg font-semibold text-gray-800 dark:text-white">${stats.heartCount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Video</p>
            <p class="text-lg font-semibold text-gray-800 dark:text-white">${stats.videoCount}</p>
          </div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informasi Lanjutan</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <span class="font-medium">SecUID:</span>
              <input type="text" value="${halfSecUid}" disabled class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed" />
            </li>
            <li><span class="font-medium">ID Pengguna:</span> ${user.id}</li>
            <li><span class="font-medium">Wilayah:</span> ${user.region}</li>
            <li><span class="font-medium">Tanggal Dibuat:</span> ${createDate}</li>
            <li><span class="font-medium">Bahasa:</span> ${user.language}</li>
            <li><span class="font-medium">Akun Komersial:</span> ${user.commerceUserInfo.commerceUser ? 'Ya' : 'Tidak'}</li>
            <li><span class="font-medium">Penjual TikTok:</span> ${user.ttSeller ? 'Ya' : 'Tidak'}</li>
            <li><span class="font-medium">Visibilitas Mengikuti:</span> ${user.followingVisibility === 1 ? 'Publik' : 'Privat'}</li>
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
    // Sembunyikan loading
    loadingDiv.classList.add('hidden');
    errorMessage.textContent = 'Terjadi kesalahan saat mengambil data';
    errorDiv.classList.remove('hidden');
  }
});