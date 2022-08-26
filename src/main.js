const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connect } = require('./utils/database/db');

const MascotasRoutes = require('./api/mascotas/mascotas.routes');


const {setUpCloudinary} = require("./utils/cloudinary/cloudinary")

connect();

setUpCloudinary()

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());


const PORT = process.env.PORT || 8080;

app.use('/api/mascotas', MascotasRoutes );

app.listen(PORT, () => {
    console.log(`Server listening on port 🙈: ${PORT}`)
});

app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});


app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
