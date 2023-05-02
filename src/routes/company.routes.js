const Router = require('express').Router;
const multer = require('multer');
const multerConfig = require('../config/multer');

const authMiddleware = require('../app/middlewares/auth');

const CompanyController = require('../app/controllers/CompanyController');

const companyRoutes = new Router();

const upload = multer(multerConfig);

companyRoutes.get('/', CompanyController.list);

companyRoutes.use(authMiddleware);

companyRoutes.post('/', upload.single('file'), CompanyController.store);
companyRoutes.put('/:id', CompanyController.update);
companyRoutes.delete('/:id', CompanyController.destroy);

module.exports = companyRoutes;
