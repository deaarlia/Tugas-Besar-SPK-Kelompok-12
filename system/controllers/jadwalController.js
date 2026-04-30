const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const simpanJadwal = async (req, res) => {
    const { anggotaId } = req.params;
    const jadwalData = req.body;

    try {
        // 1. Hapus kelasKrs dulu (child), baru jadwalHari (parent)
        const jadwalLama = await prisma.jadwalHari.findMany({
            where: { anggotaId: parseInt(anggotaId) }
        });
        const jadwalIds = jadwalLama.map(j => j.id);
        
        if (jadwalIds.length > 0) {
            await prisma.kelasKRS.deleteMany({
                where: { jadwalId: { in: jadwalIds } }
            });
        }
        await prisma.jadwalHari.deleteMany({
            where: { anggotaId: parseInt(anggotaId) }
        });

        // 2. Cek status periode
        let setting = await prisma.pengaturanSistem.findUnique({ 
            where: { nama_pengaturan: "PERIODE_ISI_JADWAL" }
        });
        let isOpen = setting ? setting.status === "buka" : true;
        let newStatus = isOpen ? "approved" : "pending";

        // 3. Simpan jadwal baru (hanya 5 hari unik)
        for (const j of jadwalData) {
            await prisma.jadwalHari.create({
                data: {
                    anggotaId: parseInt(anggotaId),
                    hari: j.hari,
                    shift1: j.shift1, shift2: j.shift2, 
                    shift3: j.shift3, shift4: j.shift4, 
                    sks: j.sks,
                    kelasKrs: {
                        create: j.kelasKrs.map(k => ({ 
                            namaMatkul: k.namaMatkul, 
                            jamMulai: k.jamMulai, 
                            jamSelesai: k.jamSelesai 
                        }))
                    }
                }
            });
        }

        // 4. Update status
        await prisma.anggota.update({
            where: { id: parseInt(anggotaId) },
            data: { status_jadwal: newStatus }
        });

        res.json({ 
            message: isOpen ? "Jadwal berhasil disimpan!" : "Jadwal diajukan untuk persetujuan Admin.", 
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
    const { anggotaId, hari, shift, action } = req.body;

    try {
        if (action === 'assign') {
            // Cek dulu apakah sudah ada, hindari duplikat
            const existing = await prisma.penugasanPiket.findFirst({
                where: { anggotaId: parseInt(anggotaId), hari, shift: parseInt(shift) }
            });
            if (!existing) {
                await prisma.penugasanPiket.create({
                    data: { anggotaId: parseInt(anggotaId), hari, shift: parseInt(shift) }
                });
            }
        } else {
            // Cancel: hapus dari tabel
            await prisma.penugasanPiket.deleteMany({
                where: { anggotaId: parseInt(anggotaId), hari, shift: parseInt(shift) }
            });
        }

        res.json({ message: "Status penugasan berhasil diubah!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengupdate penugasan." });
    }
};

const getJadwalFinal = async (req, res) => {
    try {
        const penugasan = await prisma.penugasanPiket.findMany({
            include: { anggota: true }
        });

        let finalJadwal = { 
            senin:  {1:[],2:[],3:[],4:[]}, 
            selasa: {1:[],2:[],3:[],4:[]}, 
            rabu:   {1:[],2:[],3:[],4:[]}, 
            kamis:  {1:[],2:[],3:[],4:[]}, 
            jumat:  {1:[],2:[],3:[],4:[]} 
        };

        penugasan.forEach(p => {
            if (finalJadwal[p.hari] && finalJadwal[p.hari][p.shift]) {
                finalJadwal[p.hari][p.shift].push({ 
                    anggotaId: p.anggotaId, 
                    nama: p.anggota.nama 
                });
            }
        });

        res.json(finalJadwal);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil jadwal final." });
    }
};

/// export fungsi
module.exports = { getJadwalFinal, simpanJadwal, setPenugasan, reviewPengajuan};