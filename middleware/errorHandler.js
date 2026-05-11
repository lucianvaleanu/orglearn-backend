module.exports = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : error.message;

  res.status(status).json({
    message
  });
};
