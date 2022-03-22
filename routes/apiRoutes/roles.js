const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all departments
router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM roles ORDER BY name`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});



module.exports = router;