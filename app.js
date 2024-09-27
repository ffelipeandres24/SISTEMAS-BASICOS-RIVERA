
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const Cliente = require('./models/Cliente');
const Auto = require('./models/Auto');
const Alquiler = require('./models/Alquiler');

const app = express();
app.use(bodyParser.json());


sequelize.sync().then(() => {
  console.log('conectado con la base de datos');
});


app.post('/clientes', async (req, res) => {
  const { nombre, correo, numero_licencia } = req.body;
  const cliente = await Cliente.create({ nombre, correo, numero_licencia });
  res.json(cliente);
});


app.post('/autos', async (req, res) => {
  const { marca, modelo, año, disponible } = req.body;
  const auto = await Auto.create({ marca, modelo, año, disponible });
  res.json(auto);
});


app.post('/alquileres', async (req, res) => {
  const { clienteId, autoId, fecha_inicio, fecha_fin } = req.body;
  const auto = await Auto.findByPk(autoId);

  if (!auto.disponible) {
    return res.json({ message: 'El auto no está disponible' });
  }

  const alquiler = await Alquiler.create({
    ClienteId: clienteId,
    AutoId: autoId,
    fecha_inicio,
    fecha_fin,
  });

  await auto.update({ disponible: false }); 

  res.json(alquiler);
});


app.get('/autos-disponibles', async (req, res) => {
  const autos = await Auto.findAll({ where: { disponible: true } });
  res.json(autos);
});


app.get('/alquileres', async (req, res) => {
  const alquileres = await Alquiler.findAll({
    include: [Cliente, Auto],
  });
  res.json(alquileres);
});


app.listen(3000, () => {
  console.log('Servidor ejecutándose en el puerto 3000');
});
