const MascotasRoutes = require('express').Router();
const rateLimit = require('express-rate-limit');
const { createMascota, login, getMascotas, mascotaByNick, updateMascota, deleteMascota } = require('./mascotas.controller');
const {authorize} = require("../../middleware/auth")
const upload = require("../../utils/cloudinary/upload")

const userCreateRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
});



MascotasRoutes.post('/register', [userCreateRateLimit] ,  upload.single("images"), createMascota );
MascotasRoutes.post('/login', login );
MascotasRoutes.get('/mascotaByNick/:nick', mascotaByNick );
MascotasRoutes.patch('/update/:id',  upload.single("images"), updateMascota );
MascotasRoutes.delete('/remove/:nick', deleteMascota );
MascotasRoutes.get('/', getMascotas);

module.exports = MascotasRoutes;