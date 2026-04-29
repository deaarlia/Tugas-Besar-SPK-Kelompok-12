const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAnggota = async (req, res) => {
    const members = await prisma.anggota.findMany({
        include: { jadwal: { include: { kelasKrs: true } } }
    });
    res.json(members);
};

const tambahAnggota = async (req, res) => {
    const { sn, nim, nama, jenis_kelamin } = req.body;
    try {
        const newAnggota = await prisma.anggota.create({
            data: {
                sn, nim, nama, jenis_kelamin,
                jadwal: {
                    create: [
                        { hari: 'senin' }, { hari: 'selasa' }, { hari: 'rabu' }, { hari: 'kamis' }, { hari: 'jumat' }
                    ]
                }
            }
        });
        res.json({ message: "Berhasil ditambahkan!", data: newAnggota });
    } catch (error) {
        console.error("Error from database:", error.message);
        res.status(400).json({ error: "Gagal menyimpan data! Cek terminal backend." });
    }
};

// --- FITUR BARU: RESET PASSWORD (KHUSUS ADMIN) ---
const resetPassword = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.anggota.update({
            where: { id: parseInt(id) },
            data: { password: "123456" }
        });
        res.json({ message: "Password berhasil di-reset ke default (123456)" });
    } catch (error) {
        res.status(500).json({ error: "Gagal mereset password" });
    }
};

// --- FITUR BARU: UPLOAD KRS ---
const uploadKRS = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File PDF KRS wajib dilampirkan!" });
        
        // Simpan rute file ke database
        const filePath = `/uploads/krs/${req.file.filename}`;
        
        // Update data anggota berdasarkan ID yang sedang login (didapat dari Token Satpam)
        await prisma.anggota.update({
            where: { id: req.user.id }, 
            data: { file_krs: filePath }
        });

        res.json({ message: "Mantap! File KRS berhasil diunggah.", filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menyimpan file ke database" });
    }
};

// JANGAN LUPA TAMBAHKAN NAMA FUNGSI DI MODULE.EXPORTS
module.exports = {
    getAnggota,
    tambahAnggota,
    resetPassword, 
    uploadKRS     
};
