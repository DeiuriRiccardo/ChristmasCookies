
const logout = async (req, res, next) => {
    await req.session.destroy((err) => {
        if (err) {
            console.error('Errore durante la distruzione della sessione.');
            res.status(500).send('Errore durante il logout.');
        }
        // Rimuove il cookie della sessione
        res.clearCookie('connect.sid'); // 'connect.sid' è il nome del cookie predefinito di express-session
    });
    next();
}

module.exports = logout;

