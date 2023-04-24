const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const CourtController = require('../app/controllers/CourtController');

const courtsRoutes = new Router();

courtsRoutes.get('/', CourtController.list);

courtsRoutes.use(authMiddleware);

courtsRoutes.post('/', CourtController.store);
courtsRoutes.put('/:id', CourtController.update);
courtsRoutes.delete('/:id', CourtController.destroy);

module.exports = courtsRoutes;
