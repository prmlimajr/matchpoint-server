const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const WorkingDaysController = require('../app/controllers/WorkingDaysController');

const workingDaysRoutes = new Router();

workingDaysRoutes.use(authMiddleware);

workingDaysRoutes.get('/:court_id', WorkingDaysController.list);
workingDaysRoutes.post('/', WorkingDaysController.store);
workingDaysRoutes.put('/:id', WorkingDaysController.update);
workingDaysRoutes.delete('/:id', WorkingDaysController.destroy);

module.exports = workingDaysRoutes;
