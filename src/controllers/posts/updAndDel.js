const model = require("@models/post.model");

const updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
  
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
  
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Нет прав на редактирование" });
      }
  
      post.title = title || post.title;
      post.content = content || post.content;
      await post.save();
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
  
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Нет прав на удаление" });
      }
  
      await post.deleteOne();
      res.json({ message: "Пост удалён" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

module.exports = { updatePost, deletePost };
