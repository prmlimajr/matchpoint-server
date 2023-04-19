const Router = require('express').Router;

const authMiddleware = require('../app/middlewares/auth');

const CourtReviewsController = require('../app/controllers/CourtReviewsController');

const courtReviewsRoutes = new Router();

courtReviewsRoutes.use(authMiddleware);

courtReviewsRoutes.get('/:court_id', CourtReviewsController.list);
courtReviewsRoutes.post('/:court_id', CourtReviewsController.store);
courtReviewsRoutes.put('/:court_id/:id', CourtReviewsController.update);
courtReviewsRoutes.delete('/:id', CourtReviewsController.destroy);

module.exports = courtReviewsRoutes;
