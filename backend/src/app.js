const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winston = require('winston');
const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: new winston.transports.Console()
});
const config = require('./config');
const mongoose = require('mongoose');

const { host, port, name, user, password } = config.db;
const dbConnectionString = `mongodb://${host}:${port}/${name}`;

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  auth: {
    authSource: 'admin'
  },
  user: user,
  pass: password
}).catch(reason => {
  log.error({ reason: reason, connectionString: dbConnectionString });
  process.exit(1);
});

const app = express();

if (config.env === 'prod') {
  log.info({ config: config });
  app.use(express.static('public'));
  app.use('/imagesFolders', express.static('imagesFolders'));
} else {
  log.info({ config: config });
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MERN Image upload API with Swagger',
        version: '0.1.0',
        contact: {
          name: 'Elahwany Ahmed',
          url: 'https://github.com/ahmedelahwany',
          email: 'ahmed.elahwany26@gmail.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000/'
        }
      ]
    },
    apis: [path.join(__dirname, '/routes/*.js')]
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.use('/imagesFolders', express.static('imagesFolders'));
}

const imagesRouter = require('./routes/images');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/imagesFolders', express.static('imagesFolders'));

app.use('/images', imagesRouter);

module.exports = app;
