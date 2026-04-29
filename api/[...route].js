const app = require('../app'); // Pastikan path ke app.js benar
module.exports = (req, res) => {
    return app(req, res);
};