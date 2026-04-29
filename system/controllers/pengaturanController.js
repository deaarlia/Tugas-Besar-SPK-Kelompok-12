const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ambil status pengaturan saat ini
const getPengaturan = async (req, res) => {
    try {
        let setting = await prisma.pengaturanSistem.findUnique({ where: { nama_pengaturan: "PERIODE_ISI_JADWAL" }});
        
        // Kalau belum ada di database, buat otomatis (Default: Buka)
        if (!setting) {
            setting = await prisma.pengaturanSistem.create({ 
                data: { nama_pengaturan: "PERIODE_ISI_JADWAL", status: "buka" }
            });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil pengaturan" });
    }
};

// Admin mengubah buka/tutup periode
const updatePengaturan = async (req, res) => {
    const { status, batas_waktu } = req.body;
    try {
        const setting = await prisma.pengaturanSistem.upsert({
            where: { nama_pengaturan: "PERIODE_ISI_JADWAL" },
            update: { status, batas_waktu: batas_waktu ? new Date(batas_waktu) : null },
            create: { nama_pengaturan: "PERIODE_ISI_JADWAL", status, batas_waktu: batas_waktu ? new Date(batas_waktu) : null }
        });
        res.json({ message: `Mantap! Periode jadwal sekarang di-${status}.`, setting });
    } catch (error) {
        res.status(500).json({ error: "Gagal mengubah pengaturan" });
    }
};

module.exports = { getPengaturan, updatePengaturan };