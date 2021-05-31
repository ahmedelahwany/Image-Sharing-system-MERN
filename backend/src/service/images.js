const Image = require('../model/image');
const winston = require('winston');
const jwt = require('jsonwebtoken');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/service.log'
    }),
    new winston.transports.Console()
  ]
});

const createImage = (req) => {
  let accessToken;
  logger.info(req.body.hasToken);
  if (req.body.hasToken === 'true') {
    accessToken = null;
  } else {
    accessToken = jwt.sign({ username: req.body.imgName }, 'access', {
      expiresIn: '1d'
    });
  }

  return new Promise((resolve, reject) => {
    Image.create({ likes: [], upvotes: [], image: req.file.path })
      .then((doc) => {
        resolve({ doc, accessToken });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const readImages = () => {
  return new Promise((resolve, reject) => {
    Image.find()
      .then((documents) => { resolve(documents); })
      .catch((err) => { reject(err); });
  });
};

const readImagesById = (id) => {
  return new Promise((resolve, reject) => {
    Image.findById(id)
      .then((documents) => {
        resolve(documents);
      })
      .catch((err) => {
        logger.info(`image Not Found with id: ${id}`);
        reject(err);
      });
  });
};

const changeImageById = (id, body) => {
  let accessToken;
  logger.info(body.hasToken);
  if (body.hasToken === true) {
    accessToken = null;
  } else {
    accessToken = jwt.sign({ username: body.imgName }, 'access', {
      expiresIn: '1d'
    });
  }
  logger.info(body);

  return new Promise((resolve, reject) => {
    const payload = body.payload;
    logger.info(payload);

    if (accessToken !== null) {
      const newLastElement = payload.pop();
      newLastElement.token = accessToken;
      payload.push(newLastElement);
    }
    const update = body.likes ? { likes: payload } : { upvotes: payload };
    logger.info(update);

    Image.findByIdAndUpdate(id, { ...update }, { new: true })
      .then((doc) => {
        resolve({ doc, accessToken });
      })
      .catch((err) => {
        logger.info(`image Not Found with id: ${id}`);
        reject(err);
      });
  });
};

module.exports = {
  createImage: createImage,
  readImages: readImages,
  readImagesById: readImagesById,
  changeImageById: changeImageById
};
