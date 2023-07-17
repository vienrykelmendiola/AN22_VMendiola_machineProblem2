/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/

const jwt = require('jsonwebtoken');
const secret = 'bcsAN22';

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  const token = req.headers.authorization;

  if (typeof token !== 'undefined') {
    jwt.verify(token.slice(7), secret, (err, data) => {
      if (err) {
        res.status(401).json({ error: 'Token verification failed' });
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Access denied' });
  }
};

module.exports.decode = (token) => {
  if (typeof token !== 'undefined') {
    try {
      return jwt.decode(token.slice(7), { complete: true }).payload;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};