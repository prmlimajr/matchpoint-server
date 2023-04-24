const Router = require('express').Router;
const authMiddleware = require('../app/middlewares/auth');

const LeadController = require('../app/controllers/LeadController');

const leadRoutes = new Router();

leadRoutes.post('/', LeadController.store);

leadRoutes.use(authMiddleware);

leadRoutes.get('/', LeadController.list);
leadRoutes.delete('/:id', LeadController.destroy);

module.exports = leadRoutes;
