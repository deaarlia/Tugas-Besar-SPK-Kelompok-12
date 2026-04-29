const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ===============================================
// 1. IMPORT CONTROLLERS & MIDDLEWARE
// ===============================================
const anggotaCtrl = require('../controllers/anggotaController');
const jadwalCtrl = require('../controllers/jadwalController');
const sawCtrl = require('../controllers/sawController');
const kriteriaCtrl = require('../controllers/kriteriaController');
const authCtrl = require('../controllers/authController');
const pengaturanCtrl = require('../controllers/pengaturanController');

const { cekToken, cekAdmin } = require('../middleware/authMiddleware');

// ===============================================
// 2. KONFIGURASI MULTER (UPLOAD PDF)
// ===============================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/krs')); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'KRS_' + req.user.id + '_' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Hanya format PDF yang diperbolehkan!'));
    }
});

// ===============================================
// 3. ROUTE PUBLIC (Tidak butuh token)
// ===============================================
router.post('/login', authCtrl.login); 
router.get('/anggota', anggotaCtrl.getAnggota);
router.get('/hitung-saw', sawCtrl.hitungSAW);
router.get('/kriteria', kriteriaCtrl.getKriteria);
router.get('/jadwal-final', jadwalCtrl.getJadwalFinal); 
router.get('/pengaturan', pengaturanCtrl.getPengaturan); // <--- Cek status periode (Buka/Tutup)

// ===============================================
// 4. ROUTE PRIVATE (Boleh Admin & Anggota Biasa)
// ===============================================
router.put('/jadwal/:anggotaId', cekToken, jadwalCtrl.simpanJadwal);
router.post('/anggota/upload-krs', cekToken, upload.single('fileKrs'), anggotaCtrl.uploadKRS);

// ===============================================
// 5. ROUTE PRIVATE KHUSUS ADMIN
// ===============================================
router.post('/anggota', cekToken, cekAdmin, anggotaCtrl.tambahAnggota);
router.put('/kriteria', cekToken, cekAdmin, kriteriaCtrl.updateBobot);
router.put('/penugasan', cekToken, cekAdmin, jadwalCtrl.setPenugasan);
router.post('/kriteria', cekToken, cekAdmin, kriteriaCtrl.tambahKriteria);

// Admin buka/tutup periode jadwal
router.put('/pengaturan', cekToken, cekAdmin, pengaturanCtrl.updatePengaturan);
// Admin setujui/tolak pengajuan jadwal dari user
router.put('/jadwal/review/:anggotaId', cekToken, cekAdmin, jadwalCtrl.reviewPengajuan);

module.exports = router;