const { Category } = require("../models");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await Category.create({
        name,
      });

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["id", "ASC"]],
      });
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!category) {
        throw {
          name: "NotFound",
          code: 404,
          message: "Category not found",
        };
      }
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const id = req.params.id;
      const { name } = req.body;
      const category = await Category.findByPk(id);
      if (!category) {
        throw {
          name: "NotFound",
          code: 404,
          message: "Category not found",
        };
      } else {
        await Category.update(
          {
            name,
          },
          {
            where: {
              id,
            },
          }
        );
      }
      res.status(200).json({ message: "Success update category" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const id = req.params.id;
      let category = await Category.findByPk(id);
      if (!category) {
        throw {
          name: "NotFound",
          code: 404,
          message: "Category not found",
        };
      } else {
        await Category.destroy({
          where: {
            id,
          },
        });
      }
      res.status(200).json({ message: `${category.name} success to delete` });
    } catch (error) {
      next(ErrorEvent);
    }
  }
}

module.exports = CategoryController;
