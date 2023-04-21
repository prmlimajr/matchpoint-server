const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const CompanyController = require('../app/controllers/CompanyController');

const companyRoutes = new Router();

companyRoutes.use(authMiddleware);

companyRoutes.get('/', CompanyController.list);
companyRoutes.post('/', CompanyController.store);
companyRoutes.put('/:id', CompanyController.update);
companyRoutes.delete('/:id', CompanyController.destroy);

module.exports = companyRoutes;
