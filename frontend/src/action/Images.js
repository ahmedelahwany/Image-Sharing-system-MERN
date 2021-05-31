import axios from 'axios';
import dispatcher from '../dispatcher/Dispatcher';
import * as actionConstants from '../dispatcher/ImageActionConstants';
import  * as ErrorActions from '../action/Notifications';

import winston from 'winston';
import Cookies from 'js-cookie';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

const _fetchAllImages = () => {
    axios.get('/images')
        .then(resp => {
            console.log(resp.data);
            dispatcher.dispatch({
                action: actionConstants.refreshImages,
                payload: resp.data
            });
        })
        .catch(err => {
            logger.error(err);
        });
};

const _recordImage= (formData,Options) => {
    axios.post('/images', formData,Options)
        .then((resp) =>{
            console.log('sending api call to record image');

            console.log(resp.data.doc);
            console.log(resp.data.accessToken);

            dispatcher.dispatch({
                action: actionConstants.addNewImage,
                payload: resp.data.doc
            });
            if(resp.data.accessToken !== null) Cookies.set("access", resp.data.accessToken);
        })
        .catch(err => {
            console.log(err);
             ErrorActions.ShowErrorAndThenClear(err);
        });
};

const _changeImageById= (formData,id) => {
    axios.put(`/images/${id}`, formData)
        .then((resp) =>{
            console.log('sending api call to change image');
            console.log(resp.data.doc);
            console.log(resp.data.accessToken);
            dispatcher.dispatch({
                action: actionConstants.ChangeImage,
                payload: resp.data.doc
            });
            if(resp.data.accessToken !== null) Cookies.set("access", resp.data.accessToken);
        })
        .catch(err => {
            logger.error(err);
        });
};

export const fetchAllImages = _fetchAllImages;
export const recordImage = _recordImage;
export const changeImage = _changeImageById;

