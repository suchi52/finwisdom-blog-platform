const express = require("express");

const db = require("../db");

const router = express.Router();


// ======================================
// GET ALL CATEGORIES
// ======================================

router.get("/", (req, res) => {

    const sql = `
        SELECT id, name
        FROM categories
        ORDER BY name ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch categories"
            });

        }

        res.json(results);

    });

});


module.exports = router;