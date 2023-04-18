const Router = require('express').Router;

const AuthController = require('../app/controllers/AuthController');

const authRoutes = new Router();

authRoutes.post('/', AuthController.store);

module.exports = authRoutes;
