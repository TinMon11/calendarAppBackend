const { response } = require("express");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateJWT = (req, res = response, next) => {
  // x-token from headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = payload.uid;
    req.name = payload.name;
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Token No Valido",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
