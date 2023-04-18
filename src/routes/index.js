const Router = require('express').Router;

const usersRoutes = require('./users.routes')
const authRoutes = require('./auth.routes');
const courtsRoutes = require('./courts.routes');

const routes = new Router();

routes.get('/', (req, res) => res.json({
  api: 'Matchpoint Games API',
  developedBy: {
    name: 'Paulo Lima',
    email: 'prmlimajr@hotmail.com',
    github: 'https://github.com/prmlimajr',
    linkedin: 'https://www.linkedin.com/in/prmlimajr/',
  }
}));

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/courts', courtsRoutes);


module.exports = routes;
