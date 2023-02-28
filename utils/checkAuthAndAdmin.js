import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  // console.log('Role', req.headers.authorization);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа token',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
  //   console.log(token);
  //   next();
};
