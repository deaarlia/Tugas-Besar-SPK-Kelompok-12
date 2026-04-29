const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "rahasia_tugas_spk_123";

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Jalur VIP Admin
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
        return res.json({ message: "Login Admin Berhasil!", token, role: 'admin' });
    }

    // 2. Jalur Anggota TiDB
    try {
        const user = await prisma.anggota.findUnique({
            where: { nim: username }
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "NIM atau Password salah!" });
        }

        const token = jwt.sign({ id: user.id, role: 'user', nama: user.nama }, SECRET_KEY, { expiresIn: '2h' });
        return res.json({ message: `Selamat datang, ${user.nama}`, token, role: 'user', userId: user.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Database Belum Konek" });
    }
});

const apiRoutes = require('./system/routes/apiRoutes')
app.use('/api', apiRoutes);

module.exports = app;