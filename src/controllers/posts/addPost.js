const model = require("@models/post.model");

module.exports = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const post = await model.create({ title, content });
        res.json(post);
    } catch (error) {
        console.error("Add post error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};