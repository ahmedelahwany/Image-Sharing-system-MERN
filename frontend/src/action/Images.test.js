import {describe, it} from "@jest/globals";


jest.dontMock('./Images');
import  * as actions from './Images';
import  * as actionsConstants from '../dispatcher/ImageActionConstants';
jest.mock('axios');
import axios from 'axios';
jest.mock('../dispatcher/Dispatcher');
import dispatcher from "../dispatcher/Dispatcher";

describe('Testing Images Actions', () => {


    const images = [
        {
            "likes": [],
            "upvotes": [],
            "image": 'pathTwo',
            "_id": "600d4b0b2e0f9e001bc9b798",
            "createdAt": '2021-05-13T16:48:01.953Z',
            "updatedAt": '2021-05-13T16:48:01.953Z',
            "__v": 0
        },
        {
            "likes": [],
            "upvotes": [],
            "image": 'pathOne',
            "_id": "600d4b0b2e0f9e001bd9b798",
            "createdAt": '2021-05-13T16:48:01.953Z',
            "updatedAt": '2021-05-13T16:48:01.953Z',
            "__v": 0
        }
    ];

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('fetches images and dispatch them', async () => {
        // given
        axios.get.mockReturnValue( Promise.resolve({data: images}));
        const expectedDispatchedEvent = {
            action: actionsConstants.refreshImages,
            payload: images
        };
        // when
        await actions.fetchAllImages();
        // then
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(dispatcher.dispatch).toBeCalledTimes(1);
        expect(dispatcher.dispatch).toHaveBeenCalledWith(expectedDispatchedEvent);
    });

    it('gets error during fetching images', async () => {
        // given
        axios.get.mockReturnValue(Promise.reject());
        // when
        await actions.fetchAllImages();
        // then
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(dispatcher.dispatch).toHaveBeenCalledTimes(0);
    });


});
