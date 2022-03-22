const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all departments
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments ORDER BY name`;

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

// POST new department
router.post('/department', ({ body }, res) => {
    // Data Validation
    const errors = inputCheck(body, 'name');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
        });
    });
});

// Update single departments name
router.put('/department/:id', (req, res) => {
    // ensures that any PUT request to ^ will include a 'name'
    const errors = inputCheck(req.body, 'name');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE departments SET name = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});


module.exports = router;