import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { checkAuthAndAdmin, handleValidationErrors } from './utils/index.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import mailRouter from './routes/mail.js';
import productRouter from './routes/product.js';
import categoryRouter from './routes/category.js';
import orderRouter from './routes/order.js';
import postRouter from './routes/post.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error:', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());

//для управления портами-разрешает frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use('/uploads', express.static('uploads'));

//load file-image
app.post('/upload', checkAuthAndAdmin, upload.single('image'), (req, res) => {
  res.json({
    URL: `/uploads/${req.file.originalname}`,
  });
});

//email
app.use('', mailRouter);
// app.post('/mail', MailController.postMail);

//restore password
// app.post('/auth/restore', handleValidationErrors, UserController.checkEmail);
// app.post('/auth/password', handleValidationErrors, UserController.updateUser);

//auth
app.use('/auth', authRouter);

//users
app.use('/auth', userRouter);

//CRUD POSTS
app.use('/posts', postRouter);

//CRUD CATEGORIES
app.use('/', categoryRouter);

//CRUD PRODUCTS
app.use('/', productRouter);

//CRUD ORDERS
app.use('/orders', orderRouter);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
