const mongoose = require("mongoose");

const MatriculasSchema = new mongoose.Schema(
  {
    curso: { type: String, required: true },
    profesor: { type: String, required: true, trim: true },
    student: { type: String, required: true, trim: true },
    turno: { type: String, required: true },
    finicio: { type: Date, required: true },
    ffin: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Matriculas", MatriculasSchema);
