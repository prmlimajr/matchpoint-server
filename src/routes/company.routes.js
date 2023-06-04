const Router = require('express').Router;
const multer = require('multer');
const multerConfig = require('../config/multer');

const authMiddleware = require('../app/middlewares/auth');

const CompanyController = require('../app/controllers/CompanyController');

const companyRoutes = new Router();

const upload = multer(multerConfig);

companyRoutes.get('/', CompanyController.list);
companyRoutes.get('/:id', CompanyController.listOne);

companyRoutes.use(authMiddleware);

companyRoutes.post('/', upload.fields([{
  name: 'logo', maxCount: 1
}, {
  name: 'firstPicture', maxCount: 1
}, {
  name: 'secondPicture', maxCount: 1
}, {
  name: 'thirdPicture', maxCount: 1
}, {
  name: 'courtPicture', maxCount: 1
}]), CompanyController.store);
companyRoutes.put('/:id', CompanyController.update);
companyRoutes.delete('/:id', CompanyController.destroy);

module.exports = companyRoutes;
