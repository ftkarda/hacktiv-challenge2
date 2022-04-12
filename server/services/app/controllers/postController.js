const { sequelize, Post, Tag, Category } = require("../models");
const { Op } = require("sequelize");

class PostController {
  static async createPost(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, content, imgUrl, categoryId, tag1, tag2, tag3, authorId } =
        req.body;

      const post = await Post.create(
        {
          title,
          content,
          imgUrl,
          categoryId,
          authorId,
        },
        {
          transaction: t,
        }
      );

      const tags = await Tag.bulkCreate(
        [
          { postId: post.id, name: tag1 },
          { postId: post.id, name: tag2 },
          { postId: post.id, name: tag3 },
        ],
        {
          transaction: t,
        }
      );

      await t.commit();
      res.status(201).json({ post, tags });
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }

  static async getPosts(req, res, next) {
    try {
      let { categoryId, title } = req.query;
      let options = {};

      if (title) {
        options["title"] = {
          [Op.iLike]: `%${title}%`,
        };
      }

      if (categoryId) {
        options["categoryId"] = {
          [Op.eq]: categoryId,
        };
      }

      const posts = await Post.findAll({
        include: [
          {
            model: Category,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Tag,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        where: options,
        order: [["id", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Category,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Tag,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (!post) {
        throw {
          code: 404,
          name: "NotFound",
          message: "Post not found",
        };
      } else {
        res.status(200).json(post);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      if (!post) {
        throw {
          code: 404,
          name: "NotFound",
          message: "Post not found",
        };
      } else {
        const { id } = req.params;
        let { title, content, imgUrl, categoryId, tag1, tag2, tag3 } = req.body;
        const slug = title.split(" ").join("-").toLowerCase();

        if (!tag1 || !tag2 || !tag3) {
          throw {
            code: 400,
            name: "BadRequest",
            message: "Tags is required",
          };
        }

        let updatePost = await Post.update(
          {
            title,
            content,
            imgUrl,
            categoryId,
            slug,
          },
          {
            where: {
              id,
            },
            transaction: t,
            returning: true,
          }
        );

        updatePost = updatePost[1][0];

        await Tag.destroy({ where: { postId: id }, transaction: t });

        await Tag.bulkCreate(
          [
            { postId: updatePost.id, name: tag1 },
            { postId: updatePost.id, name: tag2 },
            { postId: updatePost.id, name: tag3 },
          ],
          { transaction: t }
        );
        await t.commit();
        res.status(200).json({ message: `Success update data id ${id}` });
      }
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      if (!post) {
        throw {
          code: 404,
          name: "NotFound",
          message: "Post not found",
        };
      }

      const tag = await Tag.findOne({
        where: {
          postId: id,
        },
        transaction: t,
      });

      if (!tag) {
        throw {
          code: 404,
          name: "NotFound",
          message: "Tag not found",
        };
      }
      await Post.destroy({ where: { id } }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: `Post ${post.id} success to deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
