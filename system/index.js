const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');

// Izinkan akses publik ke folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sambungkan ke rute
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Backend berjalan di http://localhost:3000');
    });
}