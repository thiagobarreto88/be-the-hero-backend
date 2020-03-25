const express = require('express');

const ongController = require('./controllers/OngController');
const incidentController = require('./controllers/IncidentController');
const profileController = require('./controllers/ProfileController');
const loginController = require('./controllers/LoginController');

const routes = express.Router();

routes.get('/ongs', ongController.list);

routes.post('/ongs', ongController.create);

routes.post('/incidents', incidentController.create);

routes.get('/incidents', incidentController.list);

routes.delete('/incidents/:id', incidentController.delete);

routes.get('/profile', profileController.index);

routes.post('/login', loginController.login);

module.exports = routes;