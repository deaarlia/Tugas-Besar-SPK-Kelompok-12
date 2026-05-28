const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getKriteria = async (req, res) => {
    try {
        let kriteria = await prisma.kriteria.findMany();
        
        // AUTO-SEED: Jika tabel kosong, buat data default
        if (kriteria.length === 0) {
            await prisma.kriteria.createMany({
                data: [
                    { kode: 'C1', nama: 'Kekosongan (Kosong=5, Isi=1)', bobot: 0.50, tipe: 'benefit' },
                    { kode: 'C2', nama: 'Jeda / Jam Kosong', bobot: 0.25, tipe: 'benefit' },
                    { kode: 'C3', nama: 'Beban SKS Hari Ini', bobot: 0.15, tipe: 'cost' },
                    { kode: 'C4', nama: 'Gender (Penyesuaian Shift)', bobot: 0.10, tipe: 'benefit' }
                ]
            });
            kriteria = await prisma.kriteria.findMany(); // Ambil lagi setelah dibuat
        }
        res.json(kriteria);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data kriteria." });
    }
};

const updateBobot = async (req, res) => {
    const dataKriteria = req.body; // Array berisi {id, bobot}
    try {
        for (const k of dataKriteria) {
            await prisma.kriteria.update({
                where: { id: k.id },
                data: { bobot: parseFloat(k.bobot) }
            });
        }
        res.json({ message: "Bobot berhasil diperbarui!" });
    } catch (error) {
        console.error("Error update bobot:", error);
        res.status(500).json({ error: "Gagal memperbarui bobot." });
    }
};

// Tambahkan ini di kriteriaController.js
const tambahKriteria = async (req, res) => {
    // 1. Ambil deskripsi dari body request
    const { kode, nama, bobot, tipe, deskripsi } = req.body; 
    
    try {
        const kriteriaBaru = await prisma.kriteria.create({
            data: { 
                kode, 
                nama, 
                bobot: parseFloat(bobot), 
                tipe,
                deskripsi // 2. Masukkan ke dalam database melalui Prisma
            }
        });
        res.json({ message: "Kriteria baru berhasil ditambahkan!", kriteria: kriteriaBaru });
    } catch (error) {
        res.status(500).json({ error: "Gagal menambah kriteria. Pastikan kode (C1, C2...) unik." });
    }
};
const updateKriteria = async (req, res) => {
    const { id } = req.params;
    const { kode, nama, bobot, tipe, deskripsi } = req.body;

    try {
        const updated = await prisma.kriteria.update({
            where: { id: parseInt(id) },
            data: {
                kode,
                nama,
                bobot: parseFloat(bobot),
                tipe,
                deskripsi
            }
        });
        res.json({ message: "Kriteria berhasil diperbarui!", kriteria: updated });
    } catch (error) {
        console.error("Error update kriteria:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getKriteria, updateBobot, tambahKriteria, updateKriteria };