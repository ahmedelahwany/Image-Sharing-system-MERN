const winston = require('winston');

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

module.exports = (req, res, next) => {
  logger.info(req.body);
  logger.info(req.file);

  if (typeof (req.file) === 'undefined' || typeof (req.body) === 'undefined') {
    logger.error('Select a file to upload');
    return res.status(400).json({
      errors: 'Select a file to upload'
    });
  }

  if (!(req.file.mimetype).includes('jpeg') && !(req.file.mimetype).includes('png') && !(req.file.mimetype).includes('jpg')) {
    logger.error('This file type not supported , please upload an image file');
    return res.status(400).json({
      errors: 'This file type not supported , please upload an image file'
    });
  }

  if (req.file.size > 1024 * 1024 * 14) {
    logger.error('Sorry , file is too large to uploaded');
    return res.status(400).json({
      errors: 'Sorry , file is too large to uploaded'
    });
  }

  next();
};
