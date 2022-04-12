const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const postController = require("../controllers/postController");

router.get("/posts", postController.getPosts);
router.post("/posts", postController.createPost);
router.get("/posts/:id", postController.getPostById);
router.put("/posts/:id", postController.updatePost);
router.delete("/posts/:id", postController.deletePost);

router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);

module.exports = router;
