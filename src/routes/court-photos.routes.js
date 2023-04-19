const Router = require('express').Router;
const multer = require('multer');
const multerConfig = require('../config/multer');

const authMiddleware = require('../app/middlewares/auth');

const CourtPhotosController = require('../app/controllers/CourtPhotosController');

const courtPhotosRoutes = new Router();

const upload = multer(multerConfig);

courtPhotosRoutes.use(authMiddleware);

courtPhotosRoutes.post('/:court_id', upload.array('file'), CourtPhotosController.store);
courtPhotosRoutes.delete('/:court_id/:id', CourtPhotosController.destroy);

module.exports = courtPhotosRoutes;
