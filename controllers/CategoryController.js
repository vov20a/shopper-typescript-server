import CategoryModel from '../models/Category.js';

export const create = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const doc = new CategoryModel({
        title: req.body.title,
        categoryParent: req.body.categoryParent,
        nodes: req.body.nodes,
      });

      const category = await doc.save();
      res.json(category);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось создать категорию',
      });
    }
  } else {
    res.status(400).json({
      message: 'Не подходит Role',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить категории',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoryModel.findById({ _id: categoryId });
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const update = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const categoryId = req.params.id;
      await CategoryModel.updateOne(
        { _id: categoryId },
        {
          title: req.body.title,
        },
      );
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось обновить категорию',
      });
    }
  } else {
    res.status(400).json({
      message: 'Не подходит Role',
    });
  }
};

export const remove = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const categoryId = req.params.id;
      CategoryModel.findByIdAndDelete(
        {
          _id: categoryId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              message: 'Не удалось удалить категорию',
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: 'Категория не найдена',
            });
          }
          res.json({
            success: true,
          });
        },
      );
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось получить категорию',
      });
    }
  } else {
    res.status(400).json({
      message: 'Не подходит Role',
    });
  }
};
