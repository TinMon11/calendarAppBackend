/* Event Routes
    api/events
*/

const { Router } = require("express");
const router = Router();
const { validateJWT } = require("../middlewares/validateJWT");
const { validateFields } = require("../middlewares/validateFields");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");

router.use(validateJWT);

// Obtener eventos
router.get("/", getEvents);

// Crear un nuevo evento
router.post(
  "/",
  [
    // middlewares
    check("title", "El Titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate),
    check("end", "La fecha de finalización es obligatoria").custom(isDate),
    validateFields,
  ],
  createEvent
);

// Actualizar Evento
router.put("/:id", updateEvent);

// Borrar Evento
router.delete("/:id", deleteEvent);

module.exports = router;
