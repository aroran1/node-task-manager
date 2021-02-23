const auth = async (req, res, next) => {
  console.log('Auth Middleware running!');
  next();
};

module.exports = auth;