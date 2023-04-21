const Router = require('express').Router;

const usersRoutes = require('./users.routes')
const authRoutes = require('./auth.routes');
const courtsRoutes = require('./courts.routes');
const sportsRoutes = require('./sports.routes');
const workingDaysRoutes = require('./working-days.routes');
const businessHoursRoutes = require('./business-hours.routes');
const courtPhotosRoutes = require('./court-photos.routes');
const courtsReservationsRoutes = require('./courts-reservations.routes');
const courtReviewsRoutes = require('./courts-reviews.routes');
const sportsPricesRoutes = require('./sports-prices.routes');
const companyRoutes = require('./company.routes');

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
routes.use('/sports', sportsRoutes);
routes.use('/working-days', workingDaysRoutes);
routes.use('/business-hours', businessHoursRoutes);
routes.use('/court-photos', courtPhotosRoutes);
routes.use('/courts-reservations', courtsReservationsRoutes);
routes.use('/courts-reviews', courtReviewsRoutes);
routes.use('/sports-prices', sportsPricesRoutes);
routes.use('/company', companyRoutes);

module.exports = routes;
