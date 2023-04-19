require('dotenv/config');
require('express-async-errors');
const cors = require('cors');
const path = require('path');
const Youch = require('youch');
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  '/court-photos',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.use(routes);

app.use(async (err, req, res, next) => {
  if (process.env.NODE_ENV === 'dev') {
    const errors = await new Youch(err, req).toJSON();

    return res.status(500).json(errors);
  }

  return res.status(500).json({
    status: "Error",
    message: `Internal server error - ${err.message}`,
  });
});

app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));