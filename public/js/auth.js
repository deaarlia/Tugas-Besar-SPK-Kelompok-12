import { API_URL, AppState } from './config.js';

window.handleLogin = async () => {
    const userField = document.getElementById('login-user');
    const passField = document.getElementById('login-pass');
    const user = userField.value;
    const pass = passField.value;

    if (!user || !pass) {
        alert('Harap isi semua kolom!', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('userRole', data.role);
            
            // Mengambil nama asli dari pesan selamat datang
            const namaAsli = data.message.replace('Selamat datang, ', '');
            localStorage.setItem('userName', namaAsli);
            
            if(data.userId) localStorage.setItem('userId', data.userId);

            // Redirect berdasarkan role
            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            // Menggunakan Toast saja untuk error, tanpa memunculkan elemen p di HTML
            alert(data.error || 'Username atau Password salah!', 'error');
            passField.value = ''; // Kosongkan password untuk keamanan
        }
    } catch (err) { 
        alert('Gagal terhubung ke server login.', 'error'); 
    }
};

window.handleLogout = async () => {
    if (await window.showConfirm("Konfirmasi Keluar", 
        "Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan diakhiri.")) {
        localStorage.clear(); 
        location.reload(); 
    }
};

window.checkSession = async () => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole'); 
    const currentPath = window.location.pathname;

    const screenLogin = document.getElementById('screen-login');
    const screenApp = document.getElementById('screen-app');

    // JIKA TIDAK ADA TOKEN tapi mencoba akses halaman selain login
    if (!token) {
        if (!currentPath.endsWith('index.html') && currentPath !== '/') {
            window.location.href = '/index.html';
            return;
        }
        if (screenLogin) screenLogin.classList.remove('hidden');
        if (screenApp) screenApp.classList.add('hidden');
        return;
    }

    // JIKA ADA TOKEN
    if (token) {
        // Jika masih di halaman login (index.html), lempar ke halaman yang sesuai
        if (currentPath.endsWith('index.html') || currentPath === '/') {
            window.location.href = role === 'admin' ? '/admin.html' : '/user.html';
            return;
        }

        // Tampilkan aplikasi, sembunyikan login
        if (screenLogin) screenLogin.classList.add('hidden');
        if (screenApp) screenApp.classList.remove('hidden');

        // Update UI Badge
        const roleBadge = document.getElementById('role-badge');
        if (roleBadge) {
            roleBadge.innerText = role === 'admin' ? 'Admin Panel' : 'Member Area';
        }

        // Jalankan loadPage sesuai role
        window.loadPage('dashboard');
    }
};

// Fungsi untuk toggle lihat/sembunyikan password
window.togglePassword = () => {
    const passInput = document.getElementById('login-pass');
        const eyeIcon = document.getElementById('eye-icon');
            
        if (passInput.type === 'password') {
            passInput.type = 'text';
            eyeIcon.classList.replace('ph-eye', 'ph-eye-closed');
            eyeIcon.classList.add('text-indigo-600'); // Beri warna saat aktif
        } else {
            passInput.type = 'password';
            eyeIcon.classList.replace('ph-eye-closed', 'ph-eye');
            eyeIcon.classList.remove('text-indigo-600');
        }
};