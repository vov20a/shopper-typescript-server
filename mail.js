import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT } = process.env;
// console.log(EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT);
const testEmailAccount = async () => {
  await nodemailer.createTestAccount();
};
// class Mail {
//   #transporter = null;
//   constructor() {
//     this.#transporter = this.#getTransporter();
//   }
//   #getTransporter() {
//     return nodemailer.createTransport({
//       host: EMAIL_HOST,
//       port: EMAIL_PORT,
//       secure: false,
//       auth: {
//         user: EMAIL_HOST_USER,
//         pass: EMAIL_HOST_PASSWORD,
//         // host: 'smtp.ethereal.email',
//         // port: 587,
//         // secure: false,
//         // auth: {
//         //   user: testEmailAccount.user,
//         //   pass: testEmailAccount.pass,
//       },
//     });
//   }
//   async send(receiver, message) {
//     try {
//       const info = await this.#transporter.sendMail({
//         from: 'vov20a@mail.ru',
//         to: receiver,
//         subject: 'Welcome to Test site',
//         text: message,
//         html: `<b>${message}</b>`,
//       });
//       return info.messageId;
//     } catch (e) {
//       return e;
//     }
//   }
// }

// export default new Mail();
// const transporter = () => {
//   return nodemailer.createTransport({
// host: 'server10.hosting.reg.ru',
// port: 587,
// secure: false,
// auth: {
//   user: 'admin@retireclub.ru',
//   pass: 'AlexeevVova1960',
// },
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//       user: testEmailAccount.user,
//       pass: testEmailAccount.pass,
//     },
//   });
// };
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'vo20va84@gmail.com',
//     pass: 'AlexeevVova1960',
//   },
// });
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD, // generated email password
  },
  //вход через временный личный кабинет от nodemailer
  // host: 'smtp.ethereal.email',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: 'thora.hettinger@ethereal.email',
  //   pass: 'tHzabkwVg8QMJGvkMN',
  // },
});

export async function send(receiver, message) {
  try {
    const info = await transporter.sendMail({
      //'from' the same as 'auth.user'
      from: 'vov20a@mail.ru',
      to: receiver,
      subject: 'Shopper-react',
      text: message,
      html: `<b>${message}</b>`,
    });
    return info.messageId;
  } catch (e) {
    return { error: e };
  }
}
