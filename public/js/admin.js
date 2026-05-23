import { API_URL, AppState } from './config.js';

window.fetchMembers = async () => {
    try {
        const res = await fetch(`${API_URL}/anggota`);
        AppState.members = await res.json();
        window.renderTabelAnggota();
    } catch (e) { console.error(e); }
};

window.renderTabelAnggota = async () => {
    const container = document.getElementById('tabel-anggota'); 
    if(!container) return;

    try {
        let data = AppState.members;
        if (!data || data.length === 0) {
            const res = await fetch(`${API_URL}/anggota`);
            data = await res.json();
            AppState.members = data;
        }
        
        let htmlUI = `
        <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-slate-300 border-collapse">
                    <thead class="text-xs text-slate-400 uppercase tracking-wider bg-slate-900/80 border-b border-slate-700">
                        <tr>
                            <th class="px-5 py-4 font-bold">Serial Number</th>
                            <th class="px-5 py-4 font-bold">NIM</th>
                            <th class="px-5 py-4 font-bold">Nama Lengkap</th>
                            <th class="px-5 py-4 font-bold text-center">L/P</th>
                            <th class="px-5 py-4 font-bold text-center">Status Jadwal</th>
                            <th class="px-5 py-4 font-bold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700/60">`;

        data.forEach(m => {
            // Perhatikan: Gunakan status_jadwal sesuai backend Anda, bukan status
            let currentStatus = (m.status_jadwal || 'KOSONG').toUpperCase();
            
            // Penentuan Warna Badge Status
            let statusColor = currentStatus === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' : 
                              currentStatus === 'DRAFT' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' : 
                              'text-slate-300 bg-slate-700/50 border-slate-600/50';
            
            // Teks untuk Badge
            let statusText = currentStatus === 'KOSONG' ? 'BELUM ISI' : currentStatus;

            // --- LOGIKA TOMBOL AKSI ---
            let actionButtons = '';

            if (currentStatus === 'KOSONG' || !m.status_jadwal) {
                // Jika belum isi sama sekali, cuma bisa Edit, tidak bisa Approve/Reject
                actionButtons = `
                    <button onclick="window.editAnggota(${m.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg transition-all text-xs font-medium" title="Edit Data">
                        <i class="ph-bold ph-pencil-simple text-sm"></i> Edit
                    </button>
                    <span class="text-xs text-slate-500 italic ml-2">Menunggu pengisian...</span>
                `;
            } else if (currentStatus === 'APPROVED') {
                // Jika sudah di-acc, hilangkan tombol Approve/Reject, ganti dengan keterangan
                actionButtons = `
                    <button onclick="window.editAnggota(${m.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg transition-all text-xs font-medium" title="Edit Data">
                        <i class="ph-bold ph-pencil-simple text-sm"></i> Edit
                    </button>
                    <span class="inline-flex items-center ml-2 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <i class="ph-fill ph-check-circle mr-1"></i> Selesai
                    </span>
                `;
            } else {
                // Jika statusnya DRAFT (sudah isi tapi belum di-acc), tampilkan semua tombol
                actionButtons = `
                    <button onclick="window.editAnggota(${m.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg transition-all text-xs font-medium" title="Edit Jadwal">
                        <i class="ph-bold ph-pencil-simple text-sm"></i> Edit
                    </button>
                    
                    <button onclick="window.approveJadwal(${m.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg transition-all text-xs font-medium" title="Setujui Jadwal">
                        <i class="ph-bold ph-check-circle text-sm"></i> Approve
                    </button>

                    <button onclick="window.declineJadwal(${m.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 rounded-lg transition-all text-xs font-medium" title="Tolak Jadwal">
                        <i class="ph-bold ph-x-circle text-sm"></i> Reject
                    </button>
                `;
            }

            htmlUI += `
            <tr class="bg-slate-800 hover:bg-slate-700/50 transition-colors group">
                <td class="px-5 py-3 text-[13px] text-slate-300 whitespace-nowrap">${m.sn}</td>
                <td class="px-5 py-3 text-[13px] text-slate-400 whitespace-nowrap">${m.nim}</td>
                <td class="px-5 py-3 text-[13px] font-bold text-slate-200 whitespace-nowrap">${m.nama}</td>
                <td class="px-5 py-3 text-[13px] text-slate-400 text-center">${m.jenis_kelamin || m.jk || '-'}</td>
                
                <td class="px-5 py-3 text-center align-middle">
                    <span class="px-2 py-0.5 ${statusColor} text-[10px] font-bold uppercase tracking-widest rounded border">${statusText}</span>
                </td>
                
                <td class="px-5 py-3">
                    <div class="flex items-center justify-center gap-2">
                        ${actionButtons}
                    </div>
                </td>
            </tr>`;
        });

        htmlUI += `</tbody></table></div></div>`;
        container.innerHTML = htmlUI;
        
    } catch(e) { 
        console.error("Gagal memuat data anggota:", e); 
    }
};

window.editAnggota = (id) => {
    const anggotaTarget = AppState.members.find(m => m.id === id);
    
    if (!anggotaTarget) {
        return alert("Data anggota tidak ditemukan!", "error");
    }

    AppState.activeMemberData = JSON.parse(JSON.stringify(anggotaTarget));

    window.loadPage('update-jadwal');
    
    alert(`Mode Edit: Jadwal ${anggotaTarget.nama}`, "success");
};

window.approveJadwal = async (id) => {
    const isConfirmed = await window.showConfirm(
        "Setujui Jadwal?", 
        "Apakah Anda yakin ingin menyetujui jadwal anggota ini?",
        false 
    );

    if (isConfirmed) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("Sesi tidak valid. Silakan login ulang.");

            const res = await fetch(`${API_URL}/jadwal/review/${id}`, { 
                method: 'PUT', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ action: 'approve' }) 
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Gagal menyetujui jadwal");
            
            alert(data.message || "Jadwal berhasil disetujui!", "success");
            AppState.members = [];
            window.renderTabelAnggota(); 
        } catch (err) {
            alert(err.message, "error");
        }
    }
};

window.declineJadwal = async (id) => {
    const isConfirmed = await window.showConfirm(
        "Tolak Jadwal?", 
        "Apakah Anda yakin ingin menolak draf jadwal ini?",
        true 
    );

    if (isConfirmed) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("Sesi tidak valid. Silakan login ulang.");

            const res = await fetch(`${API_URL}/jadwal/review/${id}`, { 
                method: 'PUT', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ action: 'reject' }) 
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Gagal menolak jadwal");
            
            alert(data.message || "Jadwal berhasil ditolak!", "success");
            AppState.members = [];
            window.renderTabelAnggota(); 
        } catch (err) {
            alert(err.message, "error");
        }
    }
};

window.editJadwalAdmin = (id) => {
    AppState.activeMemberData = JSON.parse(JSON.stringify(AppState.members.find(x => x.id === id))); 
    window.loadPage('update-jadwal'); 
};

window.saveAnggota = async () => {
    const sn = document.getElementById('inp-sn').value, nim = document.getElementById('inp-nim').value, nama = document.getElementById('inp-nama').value, jk = document.getElementById('inp-jenis_kelamin').value;
    if (!sn || !nim || !nama) return alert('Semua kolom wajib diisi!', 'error');
    try {
        const res = await fetch(`${API_URL}/anggota`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify({ sn, nim, nama, jenis_kelamin: jk }) });
        if (res.ok) { window.closeModal('modal-tambah'); alert('Anggota tersimpan.', 'success'); window.fetchMembers(); } else alert('Gagal menyimpan.', 'error');
    } catch (err) { alert('Server error', 'error'); }
};

window.reviewJadwal = async (id, action) => {
    try { const res = await fetch(`${API_URL}/jadwal/review/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify({ action }) }); if(res.ok) { alert("Status jadwal diperbarui!", "success"); window.fetchMembers(); } } catch(e) { alert("Error", "error"); }
};

// ==========================================
// LOGIKA PERANKINGAN & PENUGASAN (DENGAN VALIDASI)
// ==========================================

window.runSAW = async () => {
    const hari = document.getElementById('sel-hari').value;
    const shift = document.getElementById('sel-shift').value;
    const resultCard = document.getElementById('result-saw');
    const tbody = document.getElementById('tabel-hasil-saw');
    
    if (!hari || !shift) return resultCard.style.display = 'none';
    resultCard.style.display = 'block'; 
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-6 text-slate-400 italic">Mengkalkulasi di Server...</td></tr>';
    
    try {
        const res = await fetch(`${API_URL}/hitung-saw?hari=${hari}&shift=${shift}`);
        const kandidat = await res.json();
        
        if(kandidat.length === 0) return tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-rose-400">Tidak ada anggota tersedia / Semua jadwal bentrok.</td></tr>`;
        
        tbody.innerHTML = '';
        kandidat.forEach((k, index) => { 
            tbody.innerHTML += `
            <tr class="border-b border-slate-700 hover:bg-slate-700/30 transition-colors group">
                <td class="px-5 py-3 font-bold text-slate-500">#${index + 1}</td>
                <td class="px-5 py-3 font-bold text-slate-200">${k.nama}</td>
                <td class="px-5 py-3 text-center">
                    <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-bold shadow-sm">${k.v}</span>
                </td>
                <td class="px-5 py-3 text-center text-xs text-slate-500 font-medium">C1:${k.c1} | C2:${k.c2} | C3:${k.c3} | C4:${k.c4}</td>
                <td class="px-5 py-3 text-center text-xs text-slate-400">${k.jeda}</td>
                <td class="px-5 py-3 text-center">
                    <button class="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm" onclick="validasiDanTugaskan(${k.anggotaId}, '${hari}', ${shift}, '${k.nama}')">Tugaskan</button>
                </td>
            </tr>`; 
        });
        
        // Panggil render tabel editor setiap kali SAW jalan
        window.renderTabelPenugasanAdmin();
    } catch (e) { console.error(e); }
};

window.validasiDanTugaskan = async (anggotaId, hari, shift, nama) => {
    try {
        const resJadwal = await fetch(`${API_URL}/jadwal-final`);
        const jadwal = await resJadwal.json();

        // VALIDASI 1: Cek Kapasitas Shift (Maksimal 2 orang)
        if (jadwal[hari] && jadwal[hari][shift] && jadwal[hari][shift].length >= 2) {
            return alert(`Gagal: Shift ${shift} di hari ${hari} sudah penuh (Maks 2 orang)!`, "error");
        }

        // VALIDASI 2: Cek Duplikasi 1 MINGGU PENUH (Senin - Jumat)
        let isAlreadyAssigned = false;
        const hariPekan = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
        
        for (const h of hariPekan) {
            for (let s = 1; s <= 4; s++) {
                // Jika anggota ditemukan di hari dan shift apapun
                if (jadwal[h] && jadwal[h][s] && jadwal[h][s].some(p => p.anggotaId === anggotaId)) {
                    isAlreadyAssigned = true;
                    break;
                }
            }
            if (isAlreadyAssigned) break; // Keluar dari loop jika sudah ketahuan dobel
        }

        if (isAlreadyAssigned) {
            return alert(`Gagal: ${nama} sudah mendapat jatah piket di hari lain! (Maks 1 shift/minggu)`, "error");
        }

        // Eksekusi penugasan jika aman
        window.updatePenugasan(anggotaId, hari, shift, 'assign');

    } catch(e) {
        alert("Gagal memvalidasi jadwal dengan server.", "error");
    }
};

window.updatePenugasan = async (anggotaId, hari, shift, action) => {
    try { 
        const res = await fetch(`${API_URL}/penugasan`, { 
            method: 'PUT', 
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
            }, 
            body: JSON.stringify({ anggotaId, hari, shift, action }) 
        }); 
        
        // JIKA SERVER MENOLAK (Dapat Error 400/500 dari Backend)
        if (!res.ok) {
            const errorData = await res.json();
            // Lempar pesan error ASLI dari backend
            throw new Error(errorData.error || errorData.message || `Server Error: ${res.status}`);
        }
        
        alert(action === 'assign' ? "Anggota berhasil ditugaskan!" : "Tugas anggota dibatalkan.", "success");
        
        // Update UI secara realtime
        if(document.getElementById('sel-hari')) window.runSAW(); 
        if(document.getElementById('container-jadwal-admin')) window.renderTabelPenugasanAdmin();
        if(document.getElementById('container-jadwal-final')) window.loadJadwalFinal(); 
        
    } catch (err) { 
        console.error("Detail Error Penugasan:", err);
        // Tampilkan pesan error ASLI ke layar (Toast)
        alert(err.message === "Failed to fetch" ? "Server backend mati / tidak merespon" : err.message, "error"); 
    }
};

window.renderTabelPenugasanAdmin = async () => {
    const container = document.getElementById('container-jadwal-admin');
    if(!container) return;

    try {
        const res = await fetch(`${API_URL}/jadwal-final`);
        const data = await res.json();
        
        let htmlUI = '<table class="w-full text-sm text-left text-slate-300"><thead class="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700"><tr><th class="px-5 py-3 font-bold">Hari</th><th class="px-5 py-3 border-l border-slate-700 font-bold">Shift 1</th><th class="px-5 py-3 border-l border-slate-700 font-bold">Shift 2</th><th class="px-5 py-3 border-l border-slate-700 font-bold">Shift 3</th><th class="px-5 py-3 border-l border-slate-700 font-bold">Shift 4</th></tr></thead><tbody class="divide-y divide-slate-700">';

        ['senin', 'selasa', 'rabu', 'kamis', 'jumat'].forEach(hari => {
            htmlUI += `<tr class="bg-slate-800 hover:bg-slate-700/50 transition-colors"><td class="px-5 py-3 capitalize font-bold text-slate-200">${hari}</td>`;
            
            [1, 2, 3, 4].forEach(s => {
                
                // 1. Desain Nama Petugas
                let namaPetugasUI = data[hari][s].map(p => { 
                    return `<div class="px-5 py-3 flex justify-between items-center font-bold text-indigo-300 text-[13px] border-b border-slate-700/60 last:border-0 group">
                        <span>${p.nama}</span> 
                        <span class="text-slate-500 hover:text-rose-400 cursor-pointer ml-2 flex items-center transition-colors opacity-0 group-hover:opacity-100" onclick="updatePenugasan(${p.anggotaId}, '${hari}', ${s}, 'cancel')" title="Hapus dari shift ini"><i class="ph-bold ph-x text-sm"></i></span>
                    </div>`; 
                }).join('');
                
                // 2. Desain Indikator Sisa Slot (Teks "Penuh" dibuang agar tidak bikin baris baru!)
                let emptySlots = 2 - data[hari][s].length;
                let slotIndicator = emptySlots > 0 
                    ? `<div class="px-5 py-2.5 text-[11px] text-slate-500 italic text-center">+ Sisa ${emptySlots} Slot</div>` 
                    : ``; // <-- Jika penuh, kembalikan teks KOSONG (tidak ada baris baru)

                // 3. Gabungkan ke dalam TD
                htmlUI += `<td class="p-0 border-l border-slate-700 align-top">${namaPetugasUI}${slotIndicator}</td>`;
            });
            htmlUI += `</tr>`;
        });
        htmlUI += '</tbody></table>';
        
        container.innerHTML = htmlUI;
    } catch(e) { console.error(e); }
};

// ==========================================
// MODUL KRITERIA (DARK MODE + EDIT + DESKRIPSI)
// ==========================================
window.loadKriteria = async () => {
    try {
        const res = await fetch(`${API_URL}/kriteria`);
        AppState.listKriteria = await res.json();
        const tbody = document.getElementById('tabel-kriteria');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        AppState.listKriteria.forEach((k, idx) => {
            // Cek apakah ada deskripsi, jika kosong beri teks default
            const desc = k.deskripsi ? k.deskripsi : '<span class="text-slate-600 italic">Belum ada deskripsi</span>';
            // Styling Badge Tipe
            const badgeTipe = k.tipe === 'benefit' 
                ? '<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Benefit</span>'
                : '<span class="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Cost</span>';

            tbody.innerHTML += `
                <tr class="border-b border-slate-700 hover:bg-slate-700/30 transition-colors group">
                    <td class="px-6 py-4 font-bold text-slate-200">${k.kode}</td>
                    <td class="px-6 py-4 font-bold text-indigo-300">${k.nama}</td>
                    <td class="px-6 py-4 text-slate-400 text-xs leading-relaxed pr-8">${desc}</td>
                    <td class="px-6 py-4 text-center">${badgeTipe}</td>
                    <td class="px-6 py-4 text-center">
                        <input type="number" step="0.01" class="border border-slate-600 bg-slate-900 text-slate-200 rounded-lg px-3 py-1.5 w-20 text-center focus:ring-2 focus:ring-indigo-500 outline-none transition" value="${k.bobot}" onchange="updateBobotLocally(${idx}, this.value)">
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onclick="window.openModalKriteria(${k.id})" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 rounded-lg transition border border-slate-700 shadow-sm" title="Edit Kriteria">
                                <i class="ph-bold ph-pencil-simple text-sm"></i>
                            </button>
                            <button onclick="alert('Fitur hapus segera hadir!')" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition border border-slate-700 shadow-sm" title="Hapus Kriteria">
                                <i class="ph-bold ph-trash text-sm"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
};

window.updateBobotLocally = (idx, val) => { AppState.listKriteria[idx].bobot = parseFloat(val); };

window.saveBobot = async () => {
    if (Math.abs(AppState.listKriteria.reduce((s, k) => s + k.bobot, 0) - 1.0) > 0.001) return alert("Total bobot wajib 1.00", "error");
    try { await fetch(`${API_URL}/kriteria`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify(AppState.listKriteria) }); alert("Bobot diperbarui!", "success"); } catch(e) { alert("Server Error", "error"); }
};

// Fungsi Pintar: Buka modal untuk TAMBAH (id null) atau EDIT (id ada)
window.openModalKriteria = (id = null) => {
    if(id) {
        const k = AppState.listKriteria.find(x => x.id === id);
        document.getElementById('kri-kode').value = k.kode;
        document.getElementById('kri-nama').value = k.nama;
        document.getElementById('kri-tipe').value = k.tipe;
        document.getElementById('kri-bobot').value = k.bobot;
        document.getElementById('kri-deskripsi').value = k.deskripsi || '';
        document.getElementById('modal-kri-title').innerText = "Edit Kriteria";
        AppState.editKriteriaId = id; // Simpan ID yang sedang diedit
    } else {
        document.getElementById('kri-kode').value = '';
        document.getElementById('kri-nama').value = '';
        document.getElementById('kri-tipe').value = 'benefit';
        document.getElementById('kri-bobot').value = '';
        document.getElementById('kri-deskripsi').value = '';
        document.getElementById('modal-kri-title').innerText = "Tambah Kriteria Baru";
        AppState.editKriteriaId = null;
    }
    window.openModal('modal-kriteria');
};

window.saveNewKriteria = async () => {
    const data = {
        kode: document.getElementById('kri-kode').value,
        nama: document.getElementById('kri-nama').value,
        tipe: document.getElementById('kri-tipe').value,
        bobot: document.getElementById('kri-bobot').value,
        deskripsi: document.getElementById('kri-deskripsi').value
    };
    if(!data.kode || !data.nama || !data.bobot) return alert("Kode, Nama, dan Bobot wajib diisi!", "error");

    try {
        // Jika ada editKriteriaId, lakukan PUT (Edit), jika tidak POST (Tambah)
        const method = AppState.editKriteriaId ? 'PUT' : 'POST';
        const url = AppState.editKriteriaId ? `${API_URL}/kriteria/${AppState.editKriteriaId}` : `${API_URL}/kriteria`;
        
        const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify(data) });
        
        if(res.ok) {
            alert(AppState.editKriteriaId ? "Kriteria berhasil diupdate!" : "Kriteria berhasil ditambah!", "success");
            window.closeModal('modal-kriteria');
            window.loadKriteria(); 
        } else { alert("Gagal menyimpan kriteria.", "error"); }
    } catch(e) { alert("Gagal koneksi ke server", "error"); }
};

window.updateBobotLocally = (idx, val) => { AppState.listKriteria[idx].bobot = parseFloat(val); };
window.saveBobot = async () => {
    if (Math.abs(AppState.listKriteria.reduce((s, k) => s + k.bobot, 0) - 1.0) > 0.001) return alert("Total bobot wajib 1.00", "error");
    try { await fetch(`${API_URL}/kriteria`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify(AppState.listKriteria) }); alert("Bobot diperbarui!", "success"); } catch(e) {}
};

window.cekStatusPeriodeUI = () => {
    const role = localStorage.getItem('userRole'), 
          btnToggle = document.getElementById('btn-toggle-periode'), 
          teksPeriode = document.getElementById('teks-periode'), 
          ikonPeriode = document.getElementById('ikon-periode');
          
    if(role === 'admin' && btnToggle) {
        btnToggle.classList.remove('hidden'); 
        
        if(AppState.statusPeriode === 'buka') { 
            teksPeriode.innerText = "Tutup Periode Jadwal"; 
            ikonPeriode.innerHTML = '<i class="ph-bold ph-lock-open text-base"></i>'; 
            // Kita gunakan ukuran diet (px-4 py-2 text-xs) dan warna Dark Mode Rose/Merah
            btnToggle.className = "flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"; 
        } 
        else { 
            teksPeriode.innerText = "Buka Periode Jadwal"; 
            ikonPeriode.innerHTML = '<i class="ph-bold ph-lock-key text-base"></i>'; 
            // Kita gunakan ukuran diet (px-4 py-2 text-xs) dan warna Dark Mode Emerald/Hijau
            btnToggle.className = "flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"; 
        }
    }
};

window.togglePeriode = async () => {
    const newStatus = AppState.statusPeriode === 'buka' ? 'tutup' : 'buka';
    if(!await window.showConfirm(`Apakah Anda yakin ingin ${newStatus} periode jadwal?`)) return;
    try {
        const res = await fetch(`${API_URL}/pengaturan`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify({ status: newStatus }) });
        if(res.ok) { AppState.statusPeriode = newStatus; window.cekStatusPeriodeUI(); alert(`Periode resmi di${newStatus}.`, 'success'); }
    } catch(e) { alert("Gagal update periode", "error"); }
};

window.exportKeExcel = () => {
    const tabelRahasia = document.getElementById('tabel-rahasia-excel');
    if(!tabelRahasia || tabelRahasia.innerHTML === "") return alert("Data jadwal kosong, tidak ada yang diekspor.", "error");
    const workbook = XLSX.utils.table_to_book(tabelRahasia, {sheet: "Jadwal Piket"});
    XLSX.writeFile(workbook, "Jadwal_Piket_NeoTelemetri.xlsx");
};