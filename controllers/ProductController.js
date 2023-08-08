import ProductModel from '../models/Product.js';
import fs from 'fs';
import path from 'path';

export const create = async (req, res) => {
  try {
    const doc = new ProductModel({
      productUrl: req.body.productUrl,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.categoryId,
      rating: req.body.rating,
      sizes: req.body.sizes,
      colors: req.body.colors,
    });

    const product = await doc.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось создать продукт',
    });
  }
};

export const getCount = async (req, res) => {
  try {
    let count = 0;
    const categoryId = req.query?.categoryId;

    // const search = req.query?.search;
    // const input = search ? { $text: { $search: search } } : {};
    const search = req.query?.search;
    const input = search ? { title: new RegExp(search, 'i') } : {};

    if (categoryId) {
      count = await ProductModel.find({
        $and: [{ categoryId: categoryId }, input],
      }).countDocuments();
    } else {
      count = await ProductModel.find(input).countDocuments();
    }
    res.json(count);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить количество товаров',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const startProduct = req.query?.startProduct;
    const limit = req.query?.limit;

    let sort = req.query?.sort;

    if (sort?.match(RegExp(/-/))) {
      sort = sort.substring(1);
      sort = sort ? `{"${sort}": -1 }` : '{"rating":-1}';
    } else {
      sort = sort ? `{"${sort}": 1 }` : '{"rating":1}';
    }
    // console.log(sort);

    const search = req.query?.search;

    // const input = search ? { $text: { $search: search } } : {};
    // const input = search ? { title: { $regexp: new RegExp(search) } } : {};
    // console.log(input);
    // const products = await ProductModel.find(input)
    const input = search ? { title: new RegExp(search, 'i') } : {};
    const products = await ProductModel.find(input)
      .sort(JSON.parse(sort))
      .skip(startProduct)
      .limit(limit)
      .populate('categoryId')
      .exec();
    //get all count//временно
    // const count = await ProductModel.find().countDocuments();
    // res.json({ products, count });
    //временно закомментировал
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить товары',
    });
  }
};
// export const getAllAggregate = async (req, res) => {
//   try {
//     const startProduct = req.query?.startProduct;
//     const limit = req.query?.limit;

//     let sort = req.query?.sort;
//     if (sort?.match(RegExp(/-/))) {
//       sort = sort.substring(1);
//       sort = sort ? `{"${sort}": -1 }` : '{"rating":-1}';
//     } else {
//       sort = sort ? `{"${sort}": 1 }` : '{"rating":1}';
//     }

//     const search = req.query?.search;
//     const input = search ? { $text: { $search: search } } : {};

//     const products = await ProductModel.aggregate([
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           description: 1,
//           price: 1,
//           rating: 1,
//           categoryId: 1,
//           productUrl: 1,
//         },
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'categoryId',
//           foreignField: '_id',
//           as: 'category',
//         },
//       },
//       { $group: { _id: null, count: { $sum: 1 } } },
//       // { $limit: 3 },
//     ]);
//     res.json({ products, count: products.length });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       message: 'Не удалось получить товары',
//     });
//   }
// };

export const getOne = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById({ _id: productId }).populate('categoryId').exec();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить товар',
    });
  }
};

export const getRandomizeProducts = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $match: {
          $expr: {
            $lt: [0.75, { $rand: {} }],
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
    ]);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить товар',
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const startProduct = req.query.startProduct;
    const limit = req.query.limit;
    const categoryId = req.params.categoryId;

    let sort = req.query?.sort;
    sort = sort ? `{"${sort}": 1 }` : '{}';

    const search = req.query?.search;
    const input = search ? { $text: { $search: search } } : {};

    const products = await ProductModel.find({
      $and: [{ categoryId: categoryId }, input],
    })
      .sort(JSON.parse(sort))
      .skip(startProduct)
      .limit(limit)
      .populate('categoryId')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить товар by categoryId',
    });
  }
};

export const update = async (req, res) => {
  try {
    const productId = req.params.id;
    await ProductModel.updateOne(
      { _id: productId },
      {
        productUrl: req.body.productUrl,
        title: req.body.title,
        types: req.body.types,
        sizes: req.body.sizes,
        price: req.body.price,
        categoryId: req.body.categoryId,
        rating: req.body.rating,
      },
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось обновить товар',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const productId = req.params.id;
    ProductModel.findByIdAndDelete(
      {
        _id: productId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            message: 'Не удалось удалить товар',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Товар не найден',
          });
        }
        //временно закомментировал
        if (doc.productUrl.includes(process.env.REACT_APP_API_URL)) {
          const fileName = doc.productUrl.match(/uploads\/[\w]+\.[\w]+/);
          const filePath = path.resolve(fileName[0]);
          // console.log(filePath);
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            // console.log(`${fileName} successfully deleted `);
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
      message: 'Не удалось получить товар',
    });
  }
};
