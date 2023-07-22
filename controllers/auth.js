const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/JWT");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Create User
      usuario = new Usuario(req.body);

      // Encryptar contraseña
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);

      // Save User after encrypting password
      await usuario.save();

      // Generate JWT
      const token = await generateJWT(usuario.id, usuario.name);

      res.status(201).json({
        success: true,
        id: usuario.id,
        name: usuario.name,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Contactar al administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        success: false,
        msg: "El usuario no existe con ese email",
      });
    } else {
      // Match with encrypted password
      const validPassword = bcrypt.compareSync(password, usuario.password);
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          id: usuario.id,
          msg: "Password Incorrecto",
        });
      }

      // Generate JWT
      const token = await generateJWT(usuario.id, usuario.name);

      res.status(200).json({
        success: true,
        uid: usuario.id,
        name: usuario.name,
        token,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Contactar al administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  // Generate JWT
  const token = await generateJWT(uid, name);

  res.status(200).json({
    success: true,
    token,
  });
};

module.exports = {
  createUser,
  renewToken,
  loginUser,
};
