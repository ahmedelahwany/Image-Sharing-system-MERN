const service = require('../service/images');

exports.createImage = (req, res, next) => {
  service.createImage(req).then(image => res.send(image)).catch(err => res.status(400).send(err));
};

exports.readImage = (req, res, next) => {
  if (req.params.id === undefined) {
    service.readImages()
      .then(images => res.send(images))
      .catch(err => res.send({ error: err }));
    return;
  }
  service.readImagesById(req.params.id)
    .then(images => res.send(images === null ? {} : images))
    .catch(err => res.send({ error: err }));
};

exports.changeImageById = (req, res, next) => {
  service.changeImageById(req.params.id, req.body)
    .then(image => res.send(image))
    .catch(err => res.status(400).send({ error: err }));
};
