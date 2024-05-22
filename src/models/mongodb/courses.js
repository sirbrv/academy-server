const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const CoursesSchema = new mongoose.Schema(
  {
    codigo: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    costo: { type: Number, required: true, trim: true },
    condicion: { type: String, required: true },
    duracion: { type: String, required: true },
    clasificacion: { type: Number, required: false },
    profesores: Mixed,
    urlImagen: { type: String, required: false },
    // profesores: [
    //   {
    //     id: { type: Number, required: false },
    //     profesor: { type: String, required: false },
    //     costoHora: { type: String, required: false },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Courses", CoursesSchema);
