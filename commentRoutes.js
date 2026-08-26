const express = require("express");

const db = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();


// ======================================
// GET COMMENTS FOR A POST
// ======================================

router.get("/post/:postId", (req, res) => {

    const postId = req.params.postId;

    const sql = `
        SELECT
            comments.id,
            comments.content,
            comments.user_id,
            comments.post_id,
            comments.created_at,
            users.name AS author
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `;

    db.query(sql, [postId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch comments"
            });
        }

        res.json(results);
    });
});


// ======================================
// CREATE COMMENT
// ======================================

router.post("/", authenticateToken, (req, res) => {

    const { content, post_id } = req.body;

    const userId = req.user.id;

    if (!content || !post_id) {
        return res.status(400).json({
            message: "Comment and post ID are required"
        });
    }

    // Check whether post exists
    const checkPost = "SELECT id FROM posts WHERE id = ?";

    db.query(checkPost, [post_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const sql = `
            INSERT INTO comments
            (content, user_id, post_id)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [content, userId, post_id],
            (err, result) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to create comment"
                    });
                }

                res.status(201).json({
                    message: "Comment added successfully",
                    commentId: result.insertId
                });
            }
        );
    });
});


// ======================================
// DELETE COMMENT
// ======================================

router.delete("/:id", authenticateToken, (req, res) => {

    const commentId = req.params.id;

    const userId = req.user.id;

    const sql = `
        DELETE FROM comments
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [commentId, userId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete comment"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Comment not found or you are not the owner"
                });
            }

            res.json({
                message: "Comment deleted successfully"
            });
        }
    );
});


module.exports = router;