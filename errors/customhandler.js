exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
