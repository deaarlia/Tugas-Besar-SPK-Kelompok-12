import { API_URL, AppState } from './config.js';

window.initUpdateJadwalPage = async () => {
    const role = localStorage.getItem('userRole');
    
    if (role === 'user') {
        if(AppState.members.length === 0) await window.fetchMembers();
        AppState.activeMemberData = JSON.parse(JSON.stringify(
            AppState.members.find(x => x.id === parseInt(localStorage.getItem('userId')))
        )); 
    }
    
    if(!AppState.activeMemberData) return window.loadPage('dashboard');

    const hariList = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
    const jadwalBersih = [];
    
    hariList.forEach(hari => {
    const entries = AppState.activeMemberData.jadwal.filter(j => j.hari === hari);
    
    if (entries.length === 0) {
        jadwalBersih.push({ 
            hari, shift1:'kosong', shift2:'kosong', 
            shift3:'kosong', shift4:'kosong', sks:0, kelasKrs:[] 
        });
    } else if (entries.length === 1) {
        // ← Deep copy supaya tidak share referensi
        jadwalBersih.push(JSON.parse(JSON.stringify(entries[0])));
    } else {
        const best = entries.reduce((a, b) => 
            (b.kelasKrs?.length || 0) > (a.kelasKrs?.length || 0) ? b : a
        );
        // ← Deep copy supaya tidak share referensi
        jadwalBersih.push(JSON.parse(JSON.stringify(best)));
    }
});

AppState.activeMemberData.jadwal = jadwalBersih;
    
    AppState.activeMemberData.jadwal = jadwalBersih;
    console.log('=== DEBUG JADWAL ===');
console.log('Member ID:', AppState.activeMemberData.id);
console.log('Nama:', AppState.activeMemberData.nama);
console.log('Jadwal:', JSON.stringify(AppState.activeMemberData.jadwal, null, 2));
console.log('===================');
    const judulPage = document.querySelector('#page-update-jadwal h2');
  
    if (role === 'admin' && judulPage) {
        judulPage.innerText = `Edit Jadwal: ${AppState.activeMemberData.nama}`;
    }

    // === 2. SISIPAN UBAH TEKS DESKRIPSI KRS (Sesuai role) ===
    const descKrs = document.getElementById('teks-desc-krs');
    if (role === 'admin' && descKrs) {
        descKrs.innerText = "Dokumen KRS yang telah dilampirkan oleh anggota untuk proses validasi.";
    } else if (descKrs) {
        descKrs.innerText = "Silakan unggah file KRS dalam format .pdf untuk validasi data.";
    }

    // === LOGIKA TOMBOL & LINK KRS ===
    const linkKrs = document.getElementById('file-link-skrg');
    const inputKrs = document.getElementById('inp-file-krs');
    
    if(linkKrs) linkKrs.innerHTML = '';
    if(inputKrs) inputKrs.style.display = 'block';

    if (role === 'admin') {
        if (inputKrs) inputKrs.style.display = 'none';
        
        if (AppState.activeMemberData.file_krs) {
            linkKrs.innerHTML = `
                <a href="${API_URL.replace('/api', '')}${AppState.activeMemberData.file_krs}" target="_blank" class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 mt-2">
                    <i class="ph-bold ph-download-simple text-base"></i> Lihat/Unduh KRS Anggota
                </a>`;
        } else {
            linkKrs.innerHTML = `
                <div class="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 mt-2">
                    <i class="ph-bold ph-x-circle"></i> Anggota ini belum melampirkan dokumen KRS.
                </div>`;
        }
    } else {
        if (AppState.activeMemberData.file_krs && linkKrs) {
            linkKrs.innerHTML = `
                <a href="${API_URL.replace('/api', '')}${AppState.activeMemberData.file_krs}" target="_blank" class="hover:underline flex items-center gap-1 mt-2">
                    <i class="ph-bold ph-file-pdf text-base"></i> Lihat file KRS saat ini
                </a>`;
        }
    }

    // === LOGIKA PERIODE TUTUP (KHUSUS USER) ===
    const msgTutup = document.getElementById('msg-tutup'), btnSave = document.getElementById('btn-save-jadwal');
    if(AppState.statusPeriode === 'tutup' && role === 'user') {
        if(msgTutup) msgTutup.classList.remove('hidden');
        if(btnSave) { 
            btnSave.innerText = "Ajukan Perubahan Jadwal"; 
            btnSave.className = "px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1"; 
        }
    }

    window.changeTab('senin');
};

window.changeTab = (hari) => {
    AppState.activeDay = hari;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if(btn.innerText.toLowerCase() === hari) { 
            btn.className = 'tab-btn bg-slate-700 text-indigo-400 border border-slate-600 shadow-sm px-6 py-2 rounded-lg font-bold text-sm transition'; 
        } else { 
            btn.className = 'tab-btn text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-6 py-2 rounded-lg font-bold text-sm transition'; 
        }
    });
    window.cekBentrokKRS();
    window.renderTabContent();
};

window.renderTabContent = () => {
    const area = document.getElementById('tab-content-area');
    if (!area) return;
    
    const dayData = AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay) || { shift1:'kosong', shift2:'kosong', shift3:'kosong', shift4:'kosong', sks:0, kelasKrs:[] };
    if(!AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay)) AppState.activeMemberData.jadwal.push({hari: AppState.activeDay, shift1:'kosong', shift2:'kosong', shift3:'kosong', shift4:'kosong', sks:0, kelasKrs:[]});

    let html = `
    <div class="flex justify-between items-center mb-3">
        <h3 class="text-[15px] font-bold text-slate-200 flex items-center">
            <i class="ph-bold ph-books text-indigo-400 mr-2 text-lg"></i> 1. Daftar KRS Hari ${AppState.activeDay.toUpperCase()}
        </h3>
        <button class="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-500/30 transition shadow-sm" onclick="addKRS()">
            <i class="ph-bold ph-plus mr-1"></i> Tambah Matkul
        </button>
    </div>
    <datalist id="saran-matkul"><option value="Kalkulus"><option value="Fisika Dasar"><option value="Pemrograman Web"><option value="Jaringan Komputer"><option value="Sistem Basis Data"></datalist>
    <div class="space-y-2 mb-2">`;
    
    if(dayData.kelasKrs.length === 0) {
        html += `<div class="p-2.5 bg-slate-900/40 border border-slate-700 border-dashed rounded-lg flex items-center justify-center text-slate-500"><p class="text-xs">Belum ada kelas terdaftar hari ini.</p></div>`;
    } else {
        dayData.kelasKrs.forEach((krs, idx) => {
            html += `
            <div class="flex flex-col md:flex-row gap-2.5 items-center group">
                <input type="text" list="saran-matkul" value="${krs.namaMatkul}" placeholder="Nama Mata Kuliah" class="w-full md:flex-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all shadow-sm" onchange="updateKRS(${idx}, 'namaMatkul', this.value)">
                
                <div class="flex items-center space-x-1.5 w-full md:w-auto">
                    <input type="time" value="${krs.jamMulai}" class="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all shadow-sm cursor-pointer" onchange="updateKRS(${idx}, 'jamMulai', this.value)">
                    <span class="text-slate-600 font-bold">-</span>
                    <input type="time" value="${krs.jamSelesai}" class="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all shadow-sm cursor-pointer" onchange="updateKRS(${idx}, 'jamSelesai', this.value)">
                    <button class="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-800 hover:bg-rose-500 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-white rounded-lg transition-all shadow-sm ml-1" onclick="removeKRS(${idx})" title="Hapus Kelas">
                        <i class="ph-bold ph-trash text-base"></i>
                    </button>
                </div>
            </div>`;
        });
    }

    html += `</div><hr class="my-4 border-slate-700">
    <div class="mb-3">
        <h3 class="text-[15px] font-bold text-slate-200 mb-0.5 flex items-center">
            <i class="ph-bold ph-clock text-indigo-400 mr-2 text-lg"></i> 2. Status Waktu Luang (Shift)
        </h3>
        <p class="text-[11px] text-slate-400">Sistem mendeteksi bentrok otomatis. Klik shift untuk mengubah status (kegiatan di luar KRS).</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">`;
    
    for(let i=1; i<=4; i++) {
        let status = dayData[`shift${i}`];
        let isKosong = status === 'kosong';
        
        let bgClass = isKosong ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20';
        let labelIcon = isKosong ? '<i class="ph-bold ph-check mr-1.5 text-sm"></i>' : '<i class="ph-bold ph-x mr-1.5 text-sm"></i>';
        let labelText = isKosong ? 'Tersedia' : 'Kegiatan';
        let timeLabel = i === 1 ? '08:00 - 10:00' : i === 2 ? '10:00 - 12:00' : i === 3 ? '12:00 - 14:00' : '14:00 - 16:00';
        
        html += `
        <div class="px-3.5 py-2.5 border rounded-lg cursor-pointer transition-all flex justify-between items-center shadow-sm ${bgClass}" onclick="toggleShift(${i})">
            <div>
                <p class="font-bold text-[13px]">Shift ${i}</p>
                <p class="text-[10px] opacity-80 mt-0.5">${timeLabel}</p>
            </div>
            <div class="text-[11px] font-bold flex items-center">${labelIcon} ${labelText}</div>
        </div>`;
    }

    html += `</div><hr class="my-4 border-slate-700">
    <h3 class="text-[15px] font-bold text-slate-200 mb-2.5 flex items-center">
        <i class="ph-bold ph-book-open text-indigo-400 mr-2 text-lg"></i> 3. Total SKS Hari Ini
    </h3>
    <input type="number" value="${dayData.sks}" placeholder="Misal: 6" class="w-full sm:w-1/3 bg-slate-900 border border-slate-600 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-indigo-500 transition shadow-inner" onchange="updateSKS(this.value)">`;
    
    area.innerHTML = html;
};

window.cekBentrokKRS = () => {
    let dayData = AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay);
    if (!dayData) return;

    const w = { 
        1: { start: 480, end: 600 }, 
        2: { start: 600, end: 720 }, 
        3: { start: 720, end: 840 }, 
        4: { start: 840, end: 960 } 
    };
    
    [1, 2, 3, 4].forEach(s => {
        const bentrok = dayData.kelasKrs.some(k => {
            if (!k.jamMulai || !k.jamSelesai) return false;
            let [h1, m1] = k.jamMulai.split(':').map(Number);
            let [h2, m2] = k.jamSelesai.split(':').map(Number);
            let kStart = h1 * 60 + m1, kEnd = h2 * 60 + m2;
            return kStart < w[s].end && kEnd > w[s].start;
        });
        // Hanya paksa 'kegiatan' jika bentrok — jangan sentuh yang tidak bentrok
        if (bentrok) dayData[`shift${s}`] = 'kegiatan';
    });
};

window.updateKRS = (idx, field, val) => { 
    AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay).kelasKrs[idx][field] = val; 
    window.cekBentrokKRS(); 
    window.renderTabContent(); 
};

window.addKRS = () => { 
    AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay).kelasKrs.push({ 
        namaMatkul: '', jamMulai: '08:00', jamSelesai: '10:00' 
    }); 
    window.cekBentrokKRS(); 
    window.renderTabContent(); 
};

window.removeKRS = (idx) => { 
    AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay).kelasKrs.splice(idx, 1); 
    window.cekBentrokKRS(); 
    window.renderTabContent(); 
};

window.toggleShift = (s) => {
    const dayData = AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay);
    if (!dayData) return;

    // 1. Definisikan jam kerja shift (dalam menit)
    const w = { 
        1: { start: 480, end: 600 },  // 08:00 - 10:00
        2: { start: 600, end: 720 },  // 10:00 - 12:00
        3: { start: 720, end: 840 },  // 12:00 - 14:00
        4: { start: 840, end: 960 }   // 14:00 - 16:00
    };

    // 2. Cek apakah shift ini memiliki bentrok nyata dengan daftar KRS
    const isBentrokKRS = dayData.kelasKrs.some(k => {
        if (!k.jamMulai || !k.jamSelesai) return false;
        
        const [h1, m1] = k.jamMulai.split(':').map(Number);
        const [h2, m2] = k.jamSelesai.split(':').map(Number);
        const kStart = h1 * 60 + m1;
        const kEnd = h2 * 60 + m2;

        // Logika overlap: Waktu mulai kuliah < Waktu selesai shift DAN Waktu selesai kuliah > Waktu mulai shift
        return kStart < w[s].end && kEnd > w[s].start;
    });

    // 3. Jika bentrok KRS ditemukan, cegah perubahan status
    if (isBentrokKRS) {
        alert(`Shift ${s} terkunci karena ada jadwal kuliah di jam tersebut.`, "error");
        return; 
    }

    // 4. Jika tidak ada bentrok KRS, izinkan toggle manual (untuk keperluan organisasi/pribadi)
    dayData[`shift${s}`] = dayData[`shift${s}`] === 'kosong' ? 'kegiatan' : 'kosong';
    
    // Refresh tampilan agar perubahan warna tombol terlihat
    window.renderTabContent();
};

window.updateSKS = (val) => { 
    AppState.activeMemberData.jadwal.find(j => j.hari === AppState.activeDay).sks = parseInt(val) || 0; 
};

window.submitJadwalUser = async () => {
    const token = localStorage.getItem('adminToken'), fileInput = document.getElementById('inp-file-krs');
    try {
        // ← Tambahkan ini
        console.log('=== DATA YANG AKAN DIKIRIM ===');
        console.log(JSON.stringify(AppState.activeMemberData.jadwal, null, 2));
        console.log('==============================');
        const resJadwal = await fetch(`${API_URL}/jadwal/${AppState.activeMemberData.id}`, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify(AppState.activeMemberData.jadwal) 
        });
        const dataJadwal = await resJadwal.json();
        if(!resJadwal.ok) throw new Error(dataJadwal.error);

        if(fileInput && fileInput.files.length > 0) {
            const formData = new FormData(); 
            formData.append('fileKrs', fileInput.files[0]);
            const resUpload = await fetch(`${API_URL}/anggota/upload-krs`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` }, 
                body: formData 
            });
            if(!resUpload.ok) alert("Jadwal tersimpan, tapi gagal upload PDF.");
        }

        alert(dataJadwal.message);
        
        // ← Tambahkan ini: reset AppState supaya fetch ulang dari server
        AppState.members = [];
        AppState.activeMemberData = null;
        
        localStorage.getItem('userRole') === 'admin' ? window.loadPage('anggota') : window.loadPage('dashboard');
    } catch (err) { alert(err.message || 'Server error!'); }
};