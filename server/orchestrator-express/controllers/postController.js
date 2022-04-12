const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

class PostController {
  static async getPosts(req, res) {
    try {
      const postsCache = await redis.get("products");
      // pengecekan terlebih dahulu, JIKA data dari cache ada
      if (postsCache) {
        // kita balikin data dari cache
        const posts = JSON.parse(postsCache);
        res.status(200).json(posts);
      } else {
        const { data } = await axios.get(
          "http://localhost:4002/customers/posts"
        );
        // kalo belum ada kita bakal hit ke servicenya & simpan datanya ke cache
        await redis.set("posts", JSON.stringify(data));
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error.response);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deletePost(req, res) {
    try {
      await axios.delete(
        "http://localhost:4002/customers/posts/" + req.params.id
      );
      await redis.del("posts");
      res.status(200).json({ message: "Success delete" });
    } catch (error) {
      console.log(error.response);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getPostById(req, res) {
    try {
      const { data: post } = await axios.get(
        "http://localhost:4002/customers/posts/" + req.params.id
      );

      const { data: user } = await axios.get(
        "http://localhost:4001/users/" + post.UserMongoId
      );
      post.User = user;
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createPost(req, res) {
    try {
      const { title, content, imgUrl, categoryId, tag1, tag2, tag3, authorId } =
        req.body;
      const slug = title.split(" ").join("-").toLowerCase();
      const response = await axios({
        method: "POST",
        url: "http://localhost:4002/customers/posts",
        data: {
          title,
          content,
          imgUrl,
          categoryId,
          tag1,
          tag2,
          tag3,
          authorId,
          slug,
        },
      });
      await redis.del("posts");
      res.status(201).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updatePost(req, res) {
    try {
      const { title, content, imgUrl, categoryId, tag1, tag2, tag3, authorId } =
        req.body;
      const slug = title.split(" ").join("-").toLowerCase();
      const response = await axios({
        method: "PUT",
        url: "http://localhost:4002/customers/posts/" + req.params.id,
        data: {
          title,
          content,
          imgUrl,
          categoryId,
          tag1,
          tag2,
          tag3,
          authorId,
          slug,
        },
      });
      await redis.del("posts");
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PostController;
