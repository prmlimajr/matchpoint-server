const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const SportsPricesController = require('../app/controllers/SportsPricesController');

const sportsPricesRoutes = new Router();

sportsPricesRoutes.use(authMiddleware);

sportsPricesRoutes.get('/:court_id/:sport_id', SportsPricesController.list);
sportsPricesRoutes.post('/:court_id/:sport_id', SportsPricesController.store);
sportsPricesRoutes.put('/:court_id/:sport_id/:id', SportsPricesController.update);
sportsPricesRoutes.delete('/:court_id/:id', SportsPricesController.destroy);

module.exports = sportsPricesRoutes;
