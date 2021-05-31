const express = require('express');
const router = express.Router();
const imagesController = require('../controller/images');
const imgValidator = require('../middlewares/imgValidator');
const uploadMulter = require('../middlewares/uploadMulter');

/**
 * @swagger
 * /images:
 *  get:
 *      summary: Fetches all images
 *      responses:
 *          200:
 *              description: list of images
 */
router.get('/', imagesController.readImage);

/**
 * @swagger
 * /images/{id}:
 *      get:
 *          summary: get image by id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: integer
 *                  required: true
 *          responses:
 *              200:
 *                  description: a single image object
 *
 */
router.get('/:id', imagesController.readImage);

/**
 * @swagger
 * /images:
 *  post:
 *      summary: create a new image
 *      requestBody:
 *        content:
 *              multipart/form-data:
 *                 schema:
 *                   type: object
 *                   properties:
 *                      hasToken:
 *                          type: boolean
 *                          example: true
 *                      imgName:
 *                          type: string
 *                      name:
 *                          type: string
 *                          format: binary
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: problem
 */
router.post('/', uploadMulter, imgValidator, imagesController.createImage);

/**
 * @swagger
 * /images/{id}:
 *     put:
 *      summary: like or upvote Image
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: integer
 *              required: true
 *      requestBody:
 *        content:
 *              application/json:
 *                 schema:
 *                   type: object
 *                   required: true
 *                   properties:
 *                      hasToken:
 *                          type: boolean
 *                          example: true
 *                      likes:
 *                          type: boolean
 *                      imgName:
 *                          type: string
 *                      payload:
 *                          type: array
 *                          items:
 *                             properties:
 *                               token:
 *                                  type: string
 *                               date:
 *                                  type: string
 *
 *      responses:
 *            200:
 *                description: successfull like or upvote
 *            400:
 *                description: error while like or upvote
 *
 */
router.put('/:id', imagesController.changeImageById);

module.exports = router;
