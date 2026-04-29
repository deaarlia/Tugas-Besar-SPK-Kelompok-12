const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET_KEY = "rahasia_tugas_spk_123"; 

const login = async (req, res) => {
    const { username, password } = req.body;

    // 1. Cek apakah yang login adalah ADMIN
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
        return res.json({ message: "Login Admin Berhasil!", token, role: 'admin' });
    }

    // 2. Jika bukan admin, cek ke tabel ANGGOTA (Login User)
    try {
        const user = await prisma.anggota.findUnique({
            where: { nim: username } // Username pakai NIM
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "NIM atau Password salah!" });
        }

        // 3. Cetak Kartu VIP untuk Anggota
        // Kita simpan ID dan Role-nya di dalam token
        const token = jwt.sign({ id: user.id, role: 'user', nama: user.nama }, SECRET_KEY, { expiresIn: '2h' });
        
        res.json({ message: `Selamat datang, ${user.nama}`, token, role: 'user', userId: user.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
};

module.exports = { login, SECRET_KEY };