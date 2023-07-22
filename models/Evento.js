const { Schema, model } = require("mongoose");

const EventoSchema = Schema({
  title: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: [true, "La fecha de inicio es obligatoria"],
  },
  end: {
    type: Date,
    required: [true, "La fecha de finalización es obligatoria"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es obligatorio"],
  },
});

EventoSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Eventos", EventoSchema);
