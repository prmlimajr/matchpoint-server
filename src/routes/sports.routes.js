const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const SportController = require('../app/controllers/SportController');

const sportsRoutes = new Router();

sportsRoutes.get('/', SportController.list);

sportsRoutes.use(authMiddleware);

sportsRoutes.post('/', SportController.store);
sportsRoutes.put('/:id', SportController.update);
sportsRoutes.delete('/:id', SportController.destroy);

module.exports = sportsRoutes;
