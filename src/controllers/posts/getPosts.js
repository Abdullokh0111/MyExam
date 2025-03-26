const model = require("@models/post.model");

const getPosts = async (req, res) => {
    try {
        const posts = await model.find().populate("author");
        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: "Posts not found" });
        }
        res.json(posts);
    } catch (error) {
        console.error("Get posts error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await model.findById(id).populate("author");
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error("Get post error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getPosts, getPostById };