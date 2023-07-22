const { response } = require("express");
const Evento = require("../models/Evento");

const getEvents = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", "name");

    res.status(200).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      error,
    });
  }
};

const createEvent = async (req, res = response) => {
  const { title, notes, start, end } = req.body;

  try {
    let evento = new Evento({
      title,
      notes,
      start,
      end,
    });

    evento.user = req.uid;

    const savedEvent = await evento.save();

    res.status(200).json({
      ok: true,
      savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const id = req.params.id;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }

    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const updatedEvent = {
      ...req.body,
      user: req.uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(id, updatedEvent, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: "Evento Actualizado",
      id,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const id = req.params.id;

  const userId = req.uid;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }

    if (evento.user.toString() !== userId) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Evento.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Evento Borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
