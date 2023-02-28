import OrderModel from '../models/Order.js';

export const create = async (req, res) => {
  try {
    const params = {
      products: req.body.products,
      email: req.body.email,
      phone: req.body.phone,
      userId: req.userId,
      totalPrice: req.body.totalPrice,
      fullName: req.body.fullName,
    };
    const doc = new OrderModel(params);
    const order = await doc.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось создать заказ',
    });
  }
};

export const getAll = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const startOrder = req.query?.startOrder;
      const limit = req.query?.limit;

      const search = req.query?.search;
      const input = search ? { $text: { $search: search } } : {};

      const orders = await OrderModel.find(input)
        .skip(startOrder)
        .limit(limit)
        .populate('userId')
        .exec();
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось получить заказы',
      });
    }
  } else {
    res.status(403).json({
      message: 'Нет доступа по Role',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById({ _id: orderId }).populate('userId').exec();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить order',
    });
  }
};

export const getCount = async (req, res) => {
  try {
    const count = await OrderModel.find().countDocuments();
    res.json(count);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить количество заказов',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const orderId = req.params.id;
    OrderModel.findByIdAndDelete(
      {
        _id: orderId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            message: 'Не удалось удалить order',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Order не найден',
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
      message: 'Не удалось получить order',
    });
  }
};
