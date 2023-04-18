const Router = require('express').Router;
const authMiddleware = require('../app/middlewares/auth');

const UserController = require('../app/controllers/UserController');

const usersRoutes = new Router();

usersRoutes.get('/', UserController.list);
usersRoutes.post('/', UserController.store);

usersRoutes.use(authMiddleware);

usersRoutes.put('/:id', UserController.update);
usersRoutes.delete('/:id', UserController.destroy);

module.exports = usersRoutes;
