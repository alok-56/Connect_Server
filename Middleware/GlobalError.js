const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 5000;
  const status = err.status || "failed";
  const message = err.message;
  const stack = err.stack;

  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

module.exports = globalErrorHandler;