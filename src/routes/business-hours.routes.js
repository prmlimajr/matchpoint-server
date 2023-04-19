const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const BusinessHoursController = require('../app/controllers/BusinessHoursController');

const businessHoursRoutes = new Router();

businessHoursRoutes.use(authMiddleware);

businessHoursRoutes.get('/:court_id', BusinessHoursController.list);
businessHoursRoutes.post('/', BusinessHoursController.store);
businessHoursRoutes.put('/:id', BusinessHoursController.update);
businessHoursRoutes.delete('/:id', BusinessHoursController.destroy);

module.exports = businessHoursRoutes;
