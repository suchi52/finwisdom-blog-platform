const express = require("express");

const db = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();


// ======================================
// GET ALL POSTS
// ======================================

router.get("/", (req, res) => {

    const sql = `
        SELECT 
            posts.id,
            posts.title,
            posts.content,
            posts.image_url,
            posts.user_id,
            posts.category_id,
            posts.created_at,
            posts.updated_at,
            users.name AS author,
            categories.name AS category
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN categories ON posts.category_id = categories.id
        ORDER BY posts.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch posts"
            });
        }

        res.json(results);
    });
});


// ======================================
// GET SINGLE POST
// ======================================

router.get("/:id", (req, res) => {

    const postId = req.params.id;

    const sql = `
        SELECT 
            posts.id,
            posts.title,
            posts.content,
            posts.image_url,
            posts.user_id,
            posts.category_id,
            posts.created_at,
            posts.updated_at,
            users.name AS author,
            categories.name AS category
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN categories ON posts.category_id = categories.id
        WHERE posts.id = ?
    `;

    db.query(sql, [postId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch post"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json(results[0]);
    });
});


// ======================================
// CREATE POST
// ======================================

router.post("/", authenticateToken, (req, res) => {

    const {
        title,
        content,
        image_url,
        category_id
    } = req.body;

    const userId = req.user.id;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const sql = `
        INSERT INTO posts
        (title, content, image_url, user_id, category_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            content,
            image_url || null,
            userId,
            category_id || null
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create post"
                });
            }

            res.status(201).json({
                message: "Post created successfully",
                postId: result.insertId
            });
        }
    );
});


// ======================================
// UPDATE POST
// ======================================

router.put("/:id", authenticateToken, (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;

    const {
        title,
        content,
        image_url,
        category_id
    } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const sql = `
        UPDATE posts
        SET
            title = ?,
            content = ?,
            image_url = ?,
            category_id = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [
            title,
            content,
            image_url || null,
            category_id || null,
            postId,
            userId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update post"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Post not found or you are not the owner"
                });
            }

            res.json({
                message: "Post updated successfully"
            });
        }
    );
});


// ======================================
// DELETE POST
// ======================================

router.delete("/:id", authenticateToken, (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;

    const sql = `
        DELETE FROM posts
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [postId, userId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete post"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Post not found or you are not the owner"
                });
            }

            res.json({
                message: "Post deleted successfully"
            });
        }
    );
});


module.exports = router;