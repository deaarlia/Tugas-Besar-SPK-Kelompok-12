// Import semua modul agar tereksekusi dan nyangkut ke window
import { API_URL, AppState } from './config.js';
import './auth.js';
import './admin.js';
import './user.js';

// ==========================================
// PUSAT NAVIGASI & UI
// ==========================================
window.loadPage = async (pageName) => {
    if (window.location.hash !== `#${pageName}`) {
        window.location.hash = pageName;
        return; 
    }

    try {
        const response = await fetch(`pages/${pageName}.html?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Gagal memuat " + pageName);
        document.getElementById('app-content').innerHTML = await response.text();

        if (pageName === 'anggota') window.fetchMembers();
        else if (pageName === 'kriteria') window.loadKriteria();
        else if (pageName === 'dashboard') {
            window.loadJadwalFinal(); 
            window.cekStatusPeriodeUI(); 
        }
        else if (pageName === 'update-jadwal') window.initUpdateJadwalPage();
        else if (pageName === 'penjadwalan') window.runSAW();

        document.querySelectorAll('#main-sidebar nav button').forEach(btn => {
            btn.classList.remove('bg-indigo-500/10', 'border-l-2', 'border-indigo-500');
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            if(icon) { icon.classList.remove('text-indigo-400'); icon.classList.add('text-slate-400'); }
            if(text) { text.classList.remove('text-indigo-300', 'font-bold'); text.classList.add('text-slate-400', 'font-medium'); }
        });
        
        const activeBtn = document.getElementById(`menu-${pageName}`);
        if (activeBtn) {
            activeBtn.classList.add('bg-indigo-500/10', 'border-l-2', 'border-indigo-500');
            const icon = activeBtn.querySelector('i');
            const text = activeBtn.querySelector('span');
            if(icon) { 
                icon.classList.remove('text-slate-400'); icon.classList.add('text-indigo-400'); 
            }
            if(text) { text.classList.remove('text-slate-400', 'font-medium'); text.classList.add('text-indigo-300', 'font-bold'); }
        }

    } catch (error) {
        document.getElementById('app-content').innerHTML = `<div class="text-center mt-20 text-red-500 font-bold text-xl">Halaman Tidak Ditemukan</div>`;
    }
};

window.openModal = (id) => { document.getElementById(id).classList.remove('hidden'); document.getElementById(id).classList.add('flex'); };
window.closeModal = (id) => { document.getElementById(id).classList.add('hidden'); document.getElementById(id).classList.remove('flex'); };
window.openModalTambah = () => { window.openModal('modal-tambah'); };

// Cek jika ada hash di URL saat pertama kali buka
window.addEventListener('load', () => {
    const lastPage = window.location.hash.substring(1); // ambil kata setelah #
    if (lastPage) {
        window.loadPage(lastPage);
    } else {
        window.checkSession(); // Default awal
    }
});

window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    
    // Bikin elemen toast baru
    const toast = document.createElement('div');
    
    // Konfigurasi warna dan ikon berdasarkan tipe (success, error, info)
    let bgColor, iconClass, textColor;
    
    if (type === 'success') {
        bgColor = 'bg-emerald-50 border-emerald-200';
        textColor = 'text-emerald-800';
        iconClass = 'ph-check-circle text-emerald-500';
    } else if (type === 'error') {
        bgColor = 'bg-red-50 border-red-200';
        textColor = 'text-red-800';
        iconClass = 'ph-warning-circle text-red-500';
    } else {
        bgColor = 'bg-indigo-50 border-indigo-200';
        textColor = 'text-indigo-800';
        iconClass = 'ph-info text-indigo-500';
    }

    // Styling Tailwind untuk animasi dan tampilan UI Toast
    toast.className = `flex items-center space-x-3 px-5 py-4 border rounded-xl shadow-lg transform transition-all duration-300 translate-x-full opacity-0 ${bgColor} pointer-events-auto min-w-[280px]`;
    
    toast.innerHTML = `
        <i class="ph-fill ${iconClass} text-2xl"></i>
        <span class="font-semibold text-sm ${textColor}">${message}</span>
    `;

    // Masukkan ke dalam container
    container.appendChild(toast);

    // Animasi Masuk (Slide In)
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Animasi Keluar (Hilang otomatis setelah 3 detik)
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        
        // Hapus elemen dari HTML setelah animasi selesai
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ==========================================
// ROUTER & NAVIGATION CONTROLLER
// ==========================================

// 1. SANG PENJAGA URL (Jalan saat tombol Back/Forward ditekan)
window.addEventListener('hashchange', () => {
    // Ambil kata setelah '#' (contoh: url '#anggota' akan jadi 'anggota')
    const page = window.location.hash.replace('#', '');
    if (page) {
        window.loadPage(page); // Panggil halaman yang sesuai
    }
});
// ==========================================
// HEADER PROFILE & SIDEBAR LOGIC
// ==========================================

window.renderHeaderProfile = () => {
    const role = localStorage.getItem('userRole');
    const profileContainer = document.getElementById('user-profile-header');
    
    const namaUser = localStorage.getItem('userName') || 'Anggota Piket';
    const nimUser = localStorage.getItem('userNim') || 'MEMBER';

    if (profileContainer) {
        if (role === 'admin') {
            profileContainer.innerHTML = `
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-bold text-slate-200">Kesekretariatan</p>
                    <p class="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Admin Piket</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-sm">
                    <i class="ph-fill ph-shield-check text-xl"></i>
                </div>
            `;
        } else {
            profileContainer.innerHTML = `
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-bold text-slate-200">${namaUser}</p>
                    <p class="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">${nimUser}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-sm">
                    <i class="ph-fill ph-user text-xl"></i>
                </div>
            `;
        }
    }
};

window.toggleSidebar = () => {
    const sidebar = document.getElementById('main-sidebar');
    const logo = document.getElementById('sidebar-logo');
    const textElements = document.querySelectorAll('.sidebar-text');
    
    // Kita cek berdasarkan lebar default (w-20)
    if (sidebar.classList.contains('w-20')) {
        
        // 1. MEKAR KAN SIDEBAR
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-72');
        
        // 2. PAKSA LOGO MEMBESAR (Scale 3x Lipat!)
        if(logo) {
            logo.style.transform = 'scale(3)'; 
        }
        
        // 3. MUNCULKAN TEKS (Dengan Delay Halus)
        textElements.forEach(el => { 
            setTimeout(() => {
                el.classList.remove('opacity-0'); 
                el.classList.add('opacity-100');
            }, 100); 
        });
        
    } else {
        
        // 1. KEMPESKAN SIDEBAR
        sidebar.classList.remove('w-72');
        sidebar.classList.add('w-20');
        
        // 2. KEMBALIKAN LOGO KE UKURAN NORMAL (Scale 1x)
        if(logo) {
            logo.style.transform = 'scale(1)';
        }
        
        // 3. SEMBUNYIKAN TEKS SEKETIKA
        textElements.forEach(el => { 
            el.classList.remove('opacity-100'); 
            el.classList.add('opacity-0'); 
        });
    }
};

window.loadJadwalFinal = async () => {
    try {
        const res = await fetch(`${API_URL}/jadwal-final`);
        const data = await res.json();
        const role = localStorage.getItem('userRole'); 
        
        let htmlUI = '<table class="w-full text-sm text-left text-slate-300"><thead class="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700"><tr><th class="px-6 py-4">Hari</th><th class="px-6 py-4 border-l border-slate-700">Shift 1</th><th class="px-6 py-4 border-l border-slate-700">Shift 2</th><th class="px-6 py-4 border-l border-slate-700">Shift 3</th><th class="px-6 py-4 border-l border-slate-700">Shift 4</th></tr></thead><tbody class="divide-y divide-slate-700">';
        let htmlExcel = '<tr><th>Hari</th><th>Shift 1 (08.00-10.00)</th><th>Shift 2 (10.00-12.00)</th><th>Shift 3 (12.00-14.00)</th><th>Shift 4 (14.00-16.00)</th></tr>';

        ['senin', 'selasa', 'rabu', 'kamis', 'jumat'].forEach(hari => {
            htmlUI += `<tr class="bg-slate-800 hover:bg-slate-700/50 transition-colors"><td class="px-6 py-4 capitalize font-bold text-slate-200">${hari}</td>`;
            htmlExcel += `<tr><td>${hari.toUpperCase()}</td>`;
            
            [1, 2, 3, 4].forEach(s => {
                // Tampilan list tanpa box, garis divider memenuhi lebar sel
                let namaPetugasUI = data[hari][s].map(p => { 
                    return `<div class="px-6 py-3 font-bold text-indigo-300 text-[13px] border-b border-slate-700/60 last:border-0">${p.nama}</div>`; 
                }).join('');
                
                // TD dipasang p-0 (padding 0) agar div memenuhi ruang
                htmlUI += `<td class="p-0 border-l border-slate-700 align-top">${namaPetugasUI || '<div class="px-6 py-4 text-slate-600 text-[13px] italic">- Kosong -</div>'}</td>`;
                htmlExcel += `<td>${data[hari][s].map(p => p.nama).join(', ') || 'Kosong'}</td>`;
            });
            htmlUI += `</tr>`; htmlExcel += `</tr>`;
        });
        htmlUI += '</tbody></table>';
        
        if(document.getElementById('container-jadwal-final')) document.getElementById('container-jadwal-final').innerHTML = htmlUI;
        if(document.getElementById('tabel-rahasia-excel')) document.getElementById('tabel-rahasia-excel').innerHTML = htmlExcel;

        // Logika Tombol Dashboard
        const btnExcel = document.getElementById('btn-unduh-excel');
        const btnTogglePeriode = document.getElementById('btn-toggle-periode');
        
        // Reset/Sembunyikan semua tombol dulu
        if(btnExcel) { btnExcel.classList.add('hidden'); btnExcel.classList.remove('flex'); }
        if(btnTogglePeriode) { btnTogglePeriode.classList.add('hidden'); btnTogglePeriode.classList.remove('flex'); }

        // Munculkan sesuai role (Hanya Admin)
        if (role === 'admin') {
            if (btnExcel) { btnExcel.classList.remove('hidden'); btnExcel.classList.add('flex'); }
            if (btnTogglePeriode) { btnTogglePeriode.classList.remove('hidden'); btnTogglePeriode.classList.add('flex'); }
        }


    } catch (e) { console.error(e); }
};

window.showConfirm = (title, message, isDanger = true) => {
    return new Promise((resolve) => {
        // Hapus modal lama jika ada (mencegah duplikasi)
        const existingModal = document.getElementById('custom-confirm-modal');
        if (existingModal) existingModal.remove();

        // Tentukan warna tema pop-up (Merah untuk bahaya/logout, Indigo untuk biasa)
        const themeColor = isDanger ? 'rose' : 'indigo';
        const icon = isDanger ? 'ph-warning' : 'ph-question';

        const modalHtml = `
        <div id="custom-confirm-modal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div id="confirm-backdrop" class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
            
            <div id="confirm-box" class="relative bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
                <div class="p-6">
                    <div class="w-12 h-12 rounded-full bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center mb-4">
                        <i class="ph-fill ${icon} text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-100 mb-2">${title}</h3>
                    <p class="text-sm text-slate-400">${message || ''}</p>
                </div>
                
                <div class="px-6 py-4 bg-slate-900/50 border-t border-slate-700 flex justify-end space-x-3">
                    <button id="btn-confirm-cancel" class="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors">Batal</button>
                    <button id="btn-confirm-ok" class="px-4 py-2 rounded-xl text-sm font-bold bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white shadow-lg shadow-${themeColor}-900/20 transition-transform transform hover:-translate-y-0.5">
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
        `;

        // Suntikkan ke dalam HTML
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('custom-confirm-modal');
        const backdrop = document.getElementById('confirm-backdrop');
        const box = document.getElementById('confirm-box');
        const btnCancel = document.getElementById('btn-confirm-cancel');
        const btnOk = document.getElementById('btn-confirm-ok');

        // Animasi masuk (Tunggu sejenak agar transisi CSS terbaca)
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            box.classList.remove('scale-95', 'opacity-0');
        }, 10);

        // Fungsi saat ditutup
        const close = (result) => {
            backdrop.classList.add('opacity-0');
            box.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.remove();
                resolve(result); // Mengembalikan true atau false ke kode pemanggil
            }, 300);
        };

        btnCancel.addEventListener('click', () => close(false));
        backdrop.addEventListener('click', () => close(false));
        btnOk.addEventListener('click', () => close(true));
    });
};

window.loadAboutPage = async () => {
    const container = document.getElementById('app-content');
    try {
        // Ambil isi file about.html
        const response = await fetch('pages/about.html');
        const html = await response.text();
        
        // Suntikkan ke dashboard
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = `<p class="text-red-400">Gagal memuat halaman tim pengembang.</p>`;
    }
};

const inisialisasiAplikasi = () => {
    const hashPage = window.location.hash.replace('#', '');
    
    // Cek apakah ada token login di memori browser
    if (localStorage.getItem('adminToken')) {
        // Jika sudah login & ada hash di URL, buka halaman itu. Kalau kosong, buka dashboard.
        window.loadPage(hashPage || 'dashboard');
    } else {
        // Jika belum login, jalankan prosedur cek sesi ke halaman login
        window.checkSession();
    }
};

// Panggil langsung fungsinya di sini!
inisialisasiAplikasi();