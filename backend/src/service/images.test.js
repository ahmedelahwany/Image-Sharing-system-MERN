jest.mock('../model/image');
const Image = require('../model/image');
const service = require('./images');

const NOT_LIKEORUPVOTED_IMAGE_ID = '5ff6ed85f1c52e5bb6d4a7f9';
const LIKED_IMAGE_ID = '5ff97028863e24203a6cbfe2';

const INVALID_IMAGE_ID = '000000000000000000000000';

const file = {
  fieldname: 'name',
  originalname: 'btn.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'destination',
  filename: 'Image',
  path: 'path',
  size: 38514
};

const body = {
  hasToken: 'true',
  imgName: 'file'
};

const IMAGE_CREATION_REQUEST = {
  file,
  body
};
const IMAGE_LIKE_REQUEST = {
  hasToken: true,
  imgName: 'name',
  likes: true,
  payload:
       [{
         token: 0,
         date: '2021-05-13T23:49:01.953Z'
       }]
};
const IMAGE_SECOND_LIKE_REQUEST_WITH_DIFFERENT_TOKEN = {
  hasToken: true,
  imgName: 'name',
  likes: true,
  payload:
        [{
          token: 0,
          date: '2021-05-13T23:49:01.953Z'
        },
        {
          token: 2,
          date: '2021-05-13T23:50:01.953Z'
        }]
};
const IMAGE_UPVOTE_REQUEST = {
  hasToken: true,
  imgName: 'name',
  likes: false,
  payload:
        [{
          token: 0,
          date: '2021-05-13T23:48:01.953Z'
        }]
};
const NOT_LIKEORUPVOTED_IMAGE = {
  likes: [],
  upvotes: [],
  image: 'pathOne',
  _id: NOT_LIKEORUPVOTED_IMAGE_ID,
  createdAt: '2021-05-13T16:48:01.953Z',
  updatedAt: '2021-05-13T16:48:01.953Z',
  __v: 0
};
const LIKED_IMAGE = {
  likes: [{
    date: '2021-05-13T23:49:01.953Z',
    token: 0
  }],
  upvotes: [],
  image: 'pathOne',
  _id: NOT_LIKEORUPVOTED_IMAGE_ID,
  createdAt: '2021-05-13T16:48:01.953Z',
  updatedAt: '2021-05-13T16:48:01.953Z',
  __v: 0
};

describe('Image Service Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Test Create Image', () => {
    Image.create.mockImplementation(() => Promise.resolve());
    expect.assertions(1);
    service.createImage(IMAGE_CREATION_REQUEST);
    expect(Image.create).toHaveBeenCalled();
  });

  it('Test Create Image with Error', () => {
    Image.create.mockImplementation(() => Promise.reject(new Error()));
    expect.assertions(1);
    service.createImage(IMAGE_CREATION_REQUEST);
    expect(Image.create).toHaveBeenCalled();
  });

  it('reads all images', () => {
    const images = [LIKED_IMAGE, NOT_LIKEORUPVOTED_IMAGE];
    Image.find.mockImplementation(() => Promise.resolve(images));
    expect.assertions(2);
    service.readImages().then((docs) => expect(docs).toEqual(images));
    expect(Image.find).toHaveBeenCalled();
  });

  it('reads all images with error', () => {
    Image.find.mockImplementation(() => Promise.reject(new Error()));
    expect.assertions(2);
    service.readImages().catch(err => expect(err).toEqual(new Error()));
    expect(Image.find).toHaveBeenCalled();
  });

  it('find an image by ID', () => {
    expect.assertions(2);
    Image.findById.mockImplementation(() => Promise.resolve(NOT_LIKEORUPVOTED_IMAGE));
    service.readImagesById(NOT_LIKEORUPVOTED_IMAGE).then((image) => {
      expect(image).toEqual(NOT_LIKEORUPVOTED_IMAGE);
    });
    expect(Image.findById).toHaveBeenCalled();
  });

  it('find a not existing image by ID', () => {
    expect.assertions(2);
    Image.findById.mockImplementation(() => Promise.reject(new Error()));
    service.readImagesById(INVALID_IMAGE_ID).catch(err => {
      expect(err).toBeDefined();
    });
    expect(Image.findById).toHaveBeenCalled();
  });

  it('like image not liked or upvoted with user has token ', async () => {
    // given
    Image.findByIdAndUpdate.mockImplementation(() => Promise.resolve());
    // when
    await service.changeImageById(NOT_LIKEORUPVOTED_IMAGE_ID, IMAGE_LIKE_REQUEST);
    // then
    expect.assertions(3);
    expect(Image.findByIdAndUpdate).toHaveBeenCalled();
    expect(Image.findByIdAndUpdate.mock.calls[0][0]).toBe(NOT_LIKEORUPVOTED_IMAGE_ID);
    expect(Image.findByIdAndUpdate.mock.calls[0][1]).toEqual({
      likes: [{
        date: '2021-05-13T23:49:01.953Z',
        token: 0
      }]
    });
  });

  it('upvote image not liked or upvoted with user has token ', async () => {
    // given
    Image.findByIdAndUpdate.mockImplementation(() => Promise.resolve());
    // when
    await service.changeImageById(NOT_LIKEORUPVOTED_IMAGE_ID, IMAGE_UPVOTE_REQUEST);
    // then
    expect.assertions(3);
    expect(Image.findByIdAndUpdate).toHaveBeenCalled();
    expect(Image.findByIdAndUpdate.mock.calls[0][0]).toBe(NOT_LIKEORUPVOTED_IMAGE_ID);
    expect(Image.findByIdAndUpdate.mock.calls[0][1]).toEqual({
      upvotes: [{
        date: '2021-05-13T23:48:01.953Z',
        token: 0
      }]
    });
  });

  it('like image which is liked with user has different token ', async () => {
    // given
    Image.findByIdAndUpdate.mockImplementation(() => Promise.resolve());
    // when
    await service.changeImageById(LIKED_IMAGE_ID, IMAGE_SECOND_LIKE_REQUEST_WITH_DIFFERENT_TOKEN);
    // then
    expect.assertions(3);

    expect(Image.findByIdAndUpdate).toHaveBeenCalled();
    expect(Image.findByIdAndUpdate.mock.calls[0][0]).toBe(LIKED_IMAGE_ID);
    expect(Image.findByIdAndUpdate.mock.calls[0][1]).toEqual({
      likes: [{
        token: 0,
        date: '2021-05-13T23:49:01.953Z'
      },
      {
        token: 2,
        date: '2021-05-13T23:50:01.953Z'
      }]
    });
  });

  it('allowed like for image but with error during update', async () => {
    // given
    Image.findByIdAndUpdate.mockImplementation(() => Promise.reject(new Error()));
    // when
    expect.assertions(4);
    try {
      await service.changeImageById(NOT_LIKEORUPVOTED_IMAGE_ID, IMAGE_LIKE_REQUEST);
    } catch (err) {
      expect(err).not.toBeNull();
    }
    // then
    expect(Image.findByIdAndUpdate).toHaveBeenCalled();
    expect(Image.findByIdAndUpdate.mock.calls[0][0]).toBe(NOT_LIKEORUPVOTED_IMAGE_ID);
    expect(Image.findByIdAndUpdate.mock.calls[0][1]).toEqual({
      likes: [{
        date: '2021-05-13T23:49:01.953Z',
        token: 0
      }]
    });
  });

  it('like image not existing', async () => {
    // given
    Image.findByIdAndUpdate.mockImplementation(() => Promise.reject(new Error()));
    // when
    expect.assertions(1);
    try {
      await service.changeImageByID(INVALID_IMAGE_ID, IMAGE_LIKE_REQUEST);
    } catch (err) {
      expect(err).not.toBeNull();
    }
  });
});
