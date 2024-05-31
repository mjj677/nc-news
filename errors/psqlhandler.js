exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code) res.status(409).send({ msg: err.message, stack: err.stack });
  else next(err);
};
