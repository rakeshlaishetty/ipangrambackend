const ErrorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  res.status(statusCode);
  res.json({
    status:false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  });
};

module.exports = {
  ErrorMiddleware,
};
