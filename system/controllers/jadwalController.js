const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const simpanJadwal = async (req, res) => {
    const { anggotaId } = req.params;
    const jadwalData = req.body; 

    try {
        // 1. CEK STATUS PERIODE (Apakah sedang buka atau tutup?)
        let setting = await prisma.pengaturanSistem.findUnique({ where: { nama_pengaturan: "PERIODE_ISI_JADWAL" }});
        let isOpen = setting ? setting.status === "buka" : true;
        
        // Jika buka -> Langsung sah (approved). Jika tutup -> Diajukan (pending)
        let newStatus = isOpen ? "approved" : "pending";

        // 2. HAPUS jadwal lama lalu SIMPAN jadwal baru
        await prisma.jadwalHari.deleteMany({ where: { anggotaId: parseInt(anggotaId) } });

        for (const j of jadwalData) {
            await prisma.jadwalHari.create({
                data: {
                    anggotaId: parseInt(anggotaId),
                    hari: j.hari, shift1: j.shift1, shift2: j.shift2, shift3: j.shift3, shift4: j.shift4, sks: j.sks,
                    kelasKrs: {
                        create: j.kelasKrs.map(k => ({ namaMatkul: k.namaMatkul, jamMulai: k.jamMulai, jamSelesai: k.jamSelesai }))
                    }
                }
            });
        }

        // 3. UPDATE STATUS JADWAL ANGGOTA
        await prisma.anggota.update({
            where: { id: parseInt(anggotaId) },
            data: { status_jadwal: newStatus }
        });

        res.json({ 
            message: isOpen ? "Jadwal berhasil disimpan permanen!" : "Periode ditutup. Jadwal diajukan untuk persetujuan Admin.", 
            status: newStatus 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menyimpan jadwal" });
    }
};

const reviewPengajuan = async (req, res) => {
    const { anggotaId } = req.params;
    const { action } = req.body; // action isinya "approve" atau "reject"

    try {
        await prisma.anggota.update({
            where: { id: parseInt(anggotaId) },
            data: { status_jadwal: action === 'approve' ? 'approved' : 'draft' }
        });
        res.json({ message: action === 'approve' ? "Jadwal disetujui!" : "Pengajuan ditolak." });
    } catch (error) {
        res.status(500).json({ error: "Gagal mereview jadwal" });
    }
};

const setPenugasan = async (req, res) => {
    const { anggotaId, hari, shift, action } = req.body; // action: 'assign' atau 'cancel'

    try {
        const jadwal = await prisma.jadwalHari.findFirst({
            where: { anggotaId: parseInt(anggotaId), hari: hari }
        });

        if (!jadwal) return res.status(404).json({error: "Jadwal tidak ditemukan"});

        const shiftField = `shift${shift}`;
        await prisma.jadwalHari.update({
            where: { id: jadwal.id },
            data: { [shiftField]: action === 'assign' ? 'piket' : 'kosong' }
        });

        res.json({ message: "Status penugasan berhasil diubah!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengupdate penugasan." });
    }
};

const getJadwalFinal = async (req, res) => {
    try {
        const members = await prisma.anggota.findMany({ include: { jadwal: true } });
        let finalJadwal = { senin: {1:[],2:[],3:[],4:[]}, selasa: {1:[],2:[],3:[],4:[]}, rabu: {1:[],2:[],3:[],4:[]}, kamis: {1:[],2:[],3:[],4:[]}, jumat: {1:[],2:[],3:[],4:[]} };

        members.forEach(m => {
            m.jadwal.forEach(j => {
                [1, 2, 3, 4].forEach(s => {
                    if (j[`shift${s}`] === 'piket') {
                        finalJadwal[j.hari][s].push({ anggotaId: m.id, nama: m.nama });
                    }
                });
            });
        });
        res.json(finalJadwal);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil jadwal final." });
    }
};

/// export fungsi
module.exports = { getJadwalFinal, simpanJadwal, setPenugasan, reviewPengajuan};