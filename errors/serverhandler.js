exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "ERROR Status 500: Internal Server Error"});
  }