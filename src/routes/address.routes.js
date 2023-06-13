const Router = require('express').Router;

const AddressController = require('../app/controllers/AddressController');

const addressRoutes = new Router();


addressRoutes.post('/', AddressController.store);

module.exports = addressRoutes;
