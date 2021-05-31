import dispatcher from '../dispatcher/Dispatcher';
import * as notificationActions from '../dispatcher/NotificatonActionConstants';



const _ShowErrorAndThenClear = (err)=>{
    dispatcher.dispatch({
        action: notificationActions.showError,
        payload: err.response.data.errors
    });
    setTimeout(()=>{
        dispatcher.dispatch({
            action: notificationActions.clearError,
            payload: 'clear error'
        });
    },5000);
};



export  const ShowErrorAndThenClear = _ShowErrorAndThenClear;