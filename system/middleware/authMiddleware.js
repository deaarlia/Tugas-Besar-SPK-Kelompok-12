const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../controllers/authController');

// Satpam Pintu Utama (Boleh masuk asal bawa token)
const cekToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Akses Ditolak! Anda belum login." });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Sesi habis! Silakan login lagi." });
        
        req.user = decoded; // Menyimpan data (role, id) dari token ke request
        next(); 
    });
};

// Satpam Ruang VIP (Khusus Admin)
const cekAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Akses Ditolak! Hanya Admin yang boleh ke sini." });
    }
    next();
};

module.exports = { cekToken, cekAdmin };