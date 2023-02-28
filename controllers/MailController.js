import { send } from '../mail.js';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const postMail = async (req, res) => {
  try {
    const email = req.body.email;
    const message = req.body.message;

    const mail = await send(email, message);
    return res.json({ mail });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось отправить письмо',
    });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json(false);
    }
    const message = `<h2>Hello ${email}</h2>
                    <p>Ссылка действительна 10 минут</p>
                    <a href=${process.env.CLIENT_URL}/password>Перейдите по ссылке</a>`;

    await send(email, message);
    res.json(email);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить User',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // console.log(req.body.date);
    const startDate = req.body.date;
    const finishDate = Date.now();
    if (finishDate - startDate > 600000) {
      return res.json({
        message: 'Истекло время действия ссылки',
      });
      // return res.error;
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      {
        email: req.body.email,
        passwordHash: hash,
      },
    );
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден UpdateUser',
      });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret123', { expiresIn: '30d' });
    const { passwordHash, ...userData } = user._doc;
    // console.log(userData);
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось изменить пароль',
    });
  }
};
