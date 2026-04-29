import { API_URL, AppState } from './config.js';

window.handleLogin = async () => {
    const userField = document.getElementById('login-user');
    const passField = document.getElementById('login-pass');
    const user = userField.value;
    const pass = passField.value;

    if (!user || !pass) {
        window.showToast('Harap isi semua kolom!', 'error');
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
            window.showToast(data.error || 'Username atau Password salah!', 'error');
            passField.value = ''; // Kosongkan password untuk keamanan
        }
    } catch (err) { 
        window.showToast('Gagal terhubung ke server login.', 'error'); 
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
    
    try {
        let resPeriode = await fetch(`${API_URL}/pengaturan`);
        let dataPeriode = await resPeriode.json();
        AppState.statusPeriode = dataPeriode.status;
    } catch(e) {}

    const screenLogin = document.getElementById('screen-login');
    const screenApp = document.getElementById('screen-app');

    if (token) {
        screenLogin.classList.add('hidden');
        screenApp.classList.remove('hidden');
        
        const roleBadge = document.getElementById('role-badge');
        if(roleBadge) {
            roleBadge.innerText = role === 'admin' ? 'Admin Panel' : 'Member Area';
            if(role === 'user') roleBadge.className = 'text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200';
        }
        
        if (role === 'admin') {
            document.getElementById('admin-menus').style.display = 'block';
            document.getElementById('menu-jadwal-saya').style.display = 'none'; 
            window.loadPage('dashboard');
        } else if (role === 'user') {
            document.getElementById('admin-menus').style.display = 'none'; 
            document.getElementById('menu-jadwal-saya').style.display = 'flex'; 
            window.loadPage('dashboard'); 
        }
    } else {
        screenApp.classList.add('hidden');
        screenLogin.classList.remove('hidden');
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