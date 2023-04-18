require('dotenv/config');
require('express-async-errors');
const cors = require('cors');
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({
    status: "Error",
    message: `Internal server error - ${err.message}`,
  });
});

app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));