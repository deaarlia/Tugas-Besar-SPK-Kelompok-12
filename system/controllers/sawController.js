const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const WAKTU_SHIFT = {
    1: { start: 480, end: 600 }, 2: { start: 600, end: 720 },
    3: { start: 720, end: 840 }, 4: { start: 840, end: 960 }
};

function hitungJeda(shiftTerpilih, kelasKrs) {
    if (!kelasKrs || kelasKrs.length === 0) return { skor: 5, status: '>60' };
    let shift = WAKTU_SHIFT[shiftTerpilih];
    let jedaTerkecil = Infinity;

    for (let k of kelasKrs) {
        let [startH, startM] = k.jamMulai.split(':').map(Number);
        let [endH, endM] = k.jamSelesai.split(':').map(Number);
        let kelasStart = startH * 60 + startM;
        let kelasEnd = endH * 60 + endM;

        if (kelasStart < shift.end && kelasEnd > shift.start) return { skor: 0, status: 'bentrok' };

        let jedaSebelum = shift.start - kelasEnd;
        let jedaSesudah = kelasStart - shift.end;

        if (jedaSebelum >= 0 && jedaSebelum < jedaTerkecil) jedaTerkecil = jedaSebelum;
        if (jedaSesudah >= 0 && jedaSesudah < jedaTerkecil) jedaTerkecil = jedaSesudah;
    }

    if (jedaTerkecil < 15) return { skor: 1, status: '<15' };
    if (jedaTerkecil <= 20) return { skor: 2, status: '15-20' };
    if (jedaTerkecil <= 30) return { skor: 3, status: '20-30' };
    if (jedaTerkecil <= 60) return { skor: 4, status: '30-60' };
    return { skor: 5, status: '>60' };
}

const hitungSAW = async (req, res) => {
    const { hari, shift } = req.query;
    if (!hari || !shift) return res.status(400).json({ error: "Hari dan Shift wajib diisi" });

    // 1. Ambil data Anggota dan Kriteria sekaligus
    const members = await prisma.anggota.findMany({ include: { jadwal: { include: { kelasKrs: true } } } });
    const dbKriteria = await prisma.kriteria.findMany(); // Ambil kriteria dari DB secara dinamis

    let kandidat = [];

    // 2. Penilaian Masing-Masing Anggota
    members.forEach(m => {
        let dataHari = m.jadwal.find(j => j.hari === hari);
        if (!dataHari) return;
        
        let isFilled = m.jadwal.some(j => j.sks > 0 || j.kelasKrs.length > 0 || j.shift1 === 'kegiatan');
        if (!isFilled) return;

        // Diskualifikasi jika shift bentrok/kegiatan/piket
        if (dataHari[`shift${shift}`] === 'kegiatan' || dataHari[`shift${shift}`] === 'piket') return;

        // --- CORE BUSINESS LOGIC (Penilaian C1 - C4) ---
        let totalKosong = 0;
        [1, 2, 3, 4].forEach(s => { if (dataHari[`shift${s}`] === 'kosong') totalKosong++; });

        let c1 = totalKosong === 0 ? 1 : totalKosong === 1 ? 3 : totalKosong === 2 ? 4 : totalKosong === 3 ? 5 : 2;
        let cekJeda = hitungJeda(shift, dataHari.kelasKrs);
        if (cekJeda.status === 'bentrok') return;

        let c2 = cekJeda.skor;
        let c3 = dataHari.sks <= 2 ? 1 : dataHari.sks <= 4 ? 2 : dataHari.sks <= 6 ? 3 : dataHari.sks <= 8 ? 4 : 5;
        let c4 = (shift == 1 || shift == 3) ? 3 : (shift == 2 && m.jenis_kelamin === 'L') ? 5 : (shift == 4 && m.jenis_kelamin === 'P') ? 5 : 1;

        // --- MAP SKOR KE OBJEK DINAMIS ---
        let scores = {};
        dbKriteria.forEach(k => {
            if (k.kode === 'C1') scores[k.kode] = c1;
            else if (k.kode === 'C2') scores[k.kode] = c2;
            else if (k.kode === 'C3') scores[k.kode] = c3;
            else if (k.kode === 'C4') scores[k.kode] = c4;
            else scores[k.kode] = 1; // Fallback jika ada kriteria baru (C5 dll) yang belum ada logikanya
        });

        // Masukkan ke daftar kandidat
        kandidat.push({ 
            anggotaId: m.id, nama: m.nama, jenis_kelamin: m.jenis_kelamin, 
            sks: dataHari.sks, jeda: cekJeda.status,
            c1, c2, c3, c4, // Tetap dikirim untuk ditampilkan di tabel UI
            scores // Ini yang dipakai untuk matematika dinamis
        });
    });

    if (kandidat.length === 0) return res.json([]);

    // 3. PENCARIAN NILAI EXTREME (MIN/MAX) SECARA DINAMIS
    let extremes = {};
    dbKriteria.forEach(k => {
        let values = kandidat.map(c => c.scores[k.kode]); // Ambil semua nilai untuk kriteria ini
        extremes[k.kode] = {
            max: Math.max(...values) || 1,
            min: Math.min(...values)
        };
        // Mencegah division by zero jika min = 0 pada kriteria cost
        if (extremes[k.kode].min === 0) extremes[k.kode].min = 1; 
    });

    // 4. NORMALISASI & PERHITUNGAN V (SECARA DINAMIS)
    kandidat.forEach(k => {
        let totalV = 0;
        
        dbKriteria.forEach(kriteria => {
            const skorAsli = k.scores[kriteria.kode];
            const ext = extremes[kriteria.kode];
            let r = 0;

            if (kriteria.tipe.toLowerCase() === 'benefit') {
                r = skorAsli / ext.max;
            } else { // Jika cost
                r = skorAsli === 0 ? 1 : (ext.min / skorAsli);
            }
            
            // Kalikan dengan bobot dan tambahkan ke Total V
            totalV += r * kriteria.bobot;
        });

        k.v = totalV.toFixed(3);
    });

    // 5. Urutkan dari V terbesar ke terkecil
    res.json(kandidat.sort((a, b) => b.v - a.v));
};

module.exports = { hitungSAW };