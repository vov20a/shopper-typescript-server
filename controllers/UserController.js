import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import { send } from '../mail.js';

export const register = async (req, res) => {
  try {
    const candidate = await UserModel.findOne({ email: req.body.email });
    if (candidate) {
      return res.status(409).json({
        message: 'Этот email занят',
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      role: 'user',
    });

    const user = await doc.save();

    const token = jwt.sign({ id: user._id, role: req.body.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться!',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    return res.status(404).json({
      message: 'Авторизоваться не удалось',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // console.log(req.userId);
    const user = await UserModel.findById(req.userId);
    req.userId = undefined;
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (err) {
    return res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
export const getCount = async (req, res) => {
  try {
    const count = await UserModel.find().countDocuments();
    res.json(count);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить количество пользователей',
    });
  }
};

export const getAll = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const startUser = req.query?.startUser;
      const limit = req.query?.limit;
      const users = await UserModel.find().skip(startUser).limit(limit).exec();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось получить пользователей',
      });
    }
  } else {
    res.status(403).json({
      message: 'Нет доступа по Role',
    });
  }
};

export const deleteUser = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const userId = req.params.id;
      const user = await UserModel.findByIdAndDelete({ _id: userId });
      req.Role = undefined;
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      res.json({ success: 'user deleted' });
    } catch (err) {
      return res.status(500).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа Role',
    });
  }
};

// export const checkEmail = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const user = await UserModel.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json(false);
//     }
//     const message = `<h2>Hello ${email}</h2>
//                     <p>Ссылка действительна 10 минут</p>
//                     <a href=${process.env.REACT_APP_API_MAIL}>Перейдите по ссылке</a>`;

//     await send(email, message);
//     res.json(email);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       message: 'Не удалось получить User',
//     });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     // console.log(req.body.date);
//     const startDate = req.body.date;
//     const finishDate = Date.now();
//     if (finishDate - startDate > 600000) {
//       return res.json({
//         message: 'Истекло время действия ссылки',
//       });
//       // return res.error;
//     }

//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await UserModel.findOneAndUpdate(
//       { email: req.body.email },
//       {
//         email: req.body.email,
//         passwordHash: hash,
//       },
//     );
//     if (!user) {
//       return res.status(404).json({
//         message: 'Пользователь не найден UpdateUser',
//       });
//     }
//     const token = jwt.sign({ id: user._id, role: user.role }, 'secret123', { expiresIn: '30d' });
//     const { passwordHash, ...userData } = user._doc;
//     // console.log(userData);
//     res.json({ ...userData, token });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       message: 'Не удалось изменить пароль',
//     });
//   }
// };

export const create = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
        role: req.body?.role || 'user',
      });

      const user = await doc.save();

      const { passwordHash, ...userData } = user._doc;

      res.json({ ...userData });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать user!',
      });
    }
  } else {
    res.status(403).json({
      message: 'Нет доступа по Role',
    });
  }
};

export const edit = async (req, res) => {
  if (req.userRole === 'admin') {
    try {
      const userId = req.params.id;
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body?.avatarUrl || '',
          passwordHash: hash,
          role: req.body?.role || 'user',
        },
      );
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден EditUser',
        });
      }

      const { passwordHash, ...userData } = user._doc;

      res.json({ ...userData });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Не удалось изменить user',
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
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (err) {
    return res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
