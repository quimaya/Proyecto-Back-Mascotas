const mongoose = require('mongoose');
const RAZAS = require ("../../utils/constants/RAZAS");
const Schema = mongoose.Schema;

const { setError } = require('../../utils/errors/error');
const { validationPassword } = require('../../utils/validations/validation');
const bcrypt = require('bcrypt');

const schema = new Schema({
    name: { type: String, unique: false, required: true },
    nick: {type: String, unique: true}, 
    password: {type: String, required: true},
    images: { type: String, required: true },
    raza: { type: String, enum: RAZAS, required: true },
    pelaje: {type: String},
    color: {type: String}
},
    {
        timestamps: true
    }
);

schema.pre( 'save', function(next) {
    if(!validationPassword( this.password )) return next(setError(400, 'INVALID PASSWORD'));
    this.password = bcrypt.hashSync( this.password, 16 );
    next();
});

module.exports = mongoose.model('mascotas', schema);
