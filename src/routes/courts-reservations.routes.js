const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const CourtsReservationsController = require('../app/controllers/CourtsReservationsController');

const courtsReservationsRoutes = new Router();

courtsReservationsRoutes.use(authMiddleware);

courtsReservationsRoutes.get('/:court_id', CourtsReservationsController.list);
courtsReservationsRoutes.post('/:court_id', CourtsReservationsController.store);
courtsReservationsRoutes.put('/:court_id/:id', CourtsReservationsController.update);
courtsReservationsRoutes.delete('/:court_id/:id', CourtsReservationsController.destroy);

module.exports = courtsReservationsRoutes;
