const Mascota = require("./mascotas.model");
const { setError } = require("../../utils/errors/error");
const { createToken } = require("../../utils/tokens/token-action");
const bcrypt = require("bcrypt");
const {deleteFile} = require("../../middleware/delete-file")

const createMascota = async (req, res, next) => {
  try {
    const newMascota = new Mascota(req.body);
    if (req.file) newMascota.images = req.file.path
    const nickExists = await Mascota.findOne({ nick: newMascota.nick });
    if (nickExists)
      return next(setError(409, "El nick de este perro ya existe"));
    const mascotaInDB = await newMascota.save();
    return res.json({
      status: 201,
      message: "Mascota creada correctamente",
      results: { mascotaInDB },
    });
  } catch (error) {
    return next(
      setError(500, error.message | "No se ha podido crear la mascota")
    );
  }
};

const login = async (req, res, next) => {
  try {
    const mascotaInDB = await Mascota.findOne({ nick: req.body.nick });
    if (!mascotaInDB) return next(setError(404, "Mascota no encontrada"));
    if (bcrypt.compareSync(req.body.password, mascotaInDB.password)) {
      const token = createToken(mascotaInDB._id, mascotaInDB.nick);
      return res.status(200).json({ mascotaInDB, token });
    } else {
      return next(setError(401, "Contraseña incorrecta"));
    }
  } catch (error) {
    return next(setError(500, "Error de logeo"));
  }
};

const mascotaByNick = async (req, res, next) => {
  try {
    const { nick } = req.params;
    const mascota = await Mascota.findOne({ nick: nick });
    if (!mascota)
      return next(setError(404, error.message | "Mascota no encontrada"));
    return res.status(200).json({
      message: "Mascota recuperada",
      mascota,
    });
  } catch (error) {
    return next(
      setError(500, "No se ha podido encontrar la mascota")
    );
  }
};

const updateMascota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = new Mascota(req.body);
    mascota._id = id;
    if (req.file) deleteFile(mascota.images);
    if (req.file) mascota.images = req.file.path

    const updatedMascota = await Mascota.findByIdAndUpdate(id, mascota);
    if (!updatedMascota) return next(setError(404, "Mascota no encotrada"));
    return res.json({
      status: 201,
      message: "Mascota actualizada",
      data: { updatedMascota },
    });
  } catch (error) {
    return next(setError(500, "No se ha podido actualizar la mascota"));
  }
};

const deleteMascota = async (req, res, next) => {
  try {
    const { nick } = req.params;
    const nickMascota = await Mascota.findOneAndRemove( { nick: nick });
    if (nickMascota.images) deleteFile(nickMascota.images)
    if( !nickMascota ) return next( setError( 404, 'Nick de la mascota no existe'));
    return res.json({
      status: 200,
      message: 'Mascota eliminada',
      results: { nickMascota }
    });
  } catch (error) {
    return next(
      setError(500,  "No se ha podido eliminar la mascota")
    );
  }
};

const getMascotas = async ( req, res, next) => {
  try {
    const mascotas = await Mascota.find();
    return res.json({
      status: 200,
      message: 'Mascotas recuperadas',
      results: { mascotas }})

  } catch (error) {
    return next(
      setError(500,  "Error recuperando")
    );
    
  }
}

module.exports = { createMascota, getMascotas, login, mascotaByNick, updateMascota, deleteMascota };
