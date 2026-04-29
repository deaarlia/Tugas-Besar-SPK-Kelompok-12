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
    
    // Pastikan element ada sebelum dimanipulasi agar tidak error
    const screenLogin = document.getElementById('screen-login');
    const screenApp = document.getElementById('screen-app');

    if (token) {
        // SEMBUNYIKAN LOGIN, TAMPILKAN APP
        if(screenLogin) screenLogin.style.display = 'none';
        if(screenApp) screenApp.style.display = 'block';
        
        // Load data periode
        try {
            let resPeriode = await fetch(`${API_URL}/pengaturan`);
            let dataPeriode = await resPeriode.json();
            AppState.statusPeriode = dataPeriode.status;
        } catch(e) {}

        const roleBadge = document.getElementById('role-badge');
        if(roleBadge) {
            roleBadge.innerText = role === 'admin' ? 'Admin Panel' : 'Member Area';
        }
        
        // Logika Menu
        const adminMenus = document.getElementById('admin-menus');
        const userMenus = document.getElementById('menu-jadwal-saya');

        if (role === 'admin') {
            if(adminMenus) adminMenus.style.display = 'block';
            if(userMenus) userMenus.style.display = 'none'; 
            window.loadPage('dashboard');
        } else {
            if(adminMenus) adminMenus.style.display = 'none'; 
            if(userMenus) userMenus.style.display = 'flex'; 
            window.loadPage('dashboard'); 
        }
    } else {
        // TIDAK ADA TOKEN: TAMPILKAN LOGIN, SEMBUNYIKAN APP
        if(screenApp) screenApp.style.display = 'none';
        if(screenLogin) screenLogin.style.display = 'block';
        
        // Jika sedang di halaman admin/user tapi tidak ada token, tendang ke index
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
            window.location.href = '/index.html';
        }
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