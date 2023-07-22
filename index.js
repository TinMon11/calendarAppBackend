require("dotenv").config();
const express = require("express");
const path = require("path");
const { dbConnection } = require("./database/config");
const cors = require("cors");

// Base de Datos
dbConnection();

const port = process.env.PORT;

//Crear Servidor Express
const app = express();

// Configure CORS
app.use(cors());

// Directorio Publico
app.use(express.static("public"));

// Lectura y Parseo del Body
app.use(express.json());

// Escuchar Peticiones
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

//Rutas
// AUTH crear,login, renwe token
app.use("/api/auth", require("./routes/auth"));
// CRUD: Eventos
app.use("/api/events", require("./routes/events"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
