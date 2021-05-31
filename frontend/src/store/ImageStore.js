import {EventEmitter} from 'events';
import dispatcher from "../dispatcher/Dispatcher";
import * as actions from '../dispatcher/ImageActionConstants';

class ImageStore extends EventEmitter{

    _Images ={AllImages:[],HotImages:[],FreshImages:[]} ;


    emitChange(){
        this.emit('Change');
    }

    addChangeListener(callback){
        this.addListener('Change',callback);
    }

    removeChangeListener(callback){
        this.removeListener('Change',callback);
    }
}

const store = new ImageStore();
export default store;

dispatcher.register(({action,payload})=>{
    if(action !== actions.refreshImages ) return;

    let AllImages= payload;
    updateStore(AllImages);
});
dispatcher.register(({action,payload})=>{
    if(action !== actions.addNewImage ) return;
    let AllImages= [...store._Images.AllImages,payload];
    updateStore(AllImages);
});
dispatcher.register(({action,payload})=>{
    if(action !== actions.ChangeImage ) return;
    let AllImages= store._Images.AllImages.map((img)=>{
        if(img._id===payload._id) {return payload;}
        else{
            return img;
        }
    });
   updateStore(AllImages);
});

function updateStore(AllImages){
    let TemoImages = [...AllImages];
    let MaxHotImagesStartDate = new Date();
    MaxHotImagesStartDate.setDate(MaxHotImagesStartDate.getDate()-3);
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-1);
    let HotAndFreshImages = divideIntoHotOrFresh(TemoImages,startDate,new Date(),MaxHotImagesStartDate);
    console.log(HotAndFreshImages);
    console.log(AllImages);
    store._Images ={
        AllImages,
        HotImages: HotAndFreshImages.hotImages,
        FreshImages: HotAndFreshImages.freshImages
    };
    store.emitChange();
}

function divideIntoHotOrFresh(qeImages,startDate,endDate, MaxHotImagesStartDate){
    const hotImagesStartDate = startDate;
    const hotImagesEndDate = endDate;
    const imagesSortedBasedOnCount=[];
    let Images=qeImages;
    Images.forEach((img)=>{
        let count=0;
        img.likes.forEach((like)=>{
            if(new Date (like.date) >= hotImagesStartDate &&  new Date(like.date) <= hotImagesEndDate) count++;
        });
        img.upvotes.forEach((upvote)=>{
            if(new Date (upvote.date) >= hotImagesStartDate && new Date (upvote.date) <= hotImagesEndDate) count++;
        });
        console.log(count);
        if (count>0) imagesSortedBasedOnCount.push({id:img._id,count});
    });
    if(imagesSortedBasedOnCount.length === 0 && hotImagesStartDate>MaxHotImagesStartDate ){
        console.log('jjj');
        let decrementHotImagesStartDate = new Date(hotImagesStartDate);
        decrementHotImagesStartDate.setDate(decrementHotImagesStartDate.getDate()-1);
        let HotAndFreshImgs = divideIntoHotOrFresh(Images,decrementHotImagesStartDate,hotImagesEndDate,MaxHotImagesStartDate);
          if (HotAndFreshImgs) return HotAndFreshImgs;
    }
    if(imagesSortedBasedOnCount.length>0) {
        imagesSortedBasedOnCount.sort((a, b) => b.count - a.count);
        console.log(imagesSortedBasedOnCount);
        let HotImagesSorted = imagesSortedBasedOnCount.map((img) => {
            return Images.find(i => i._id === img.id);
        });
        HotImagesSorted =HotImagesSorted.length>5?HotImagesSorted.slice(0,5):HotImagesSorted;
        const freshImagesNotSorted = Images.filter((img) => {
            return !HotImagesSorted.find(element => {
                return element._id === img._id;
            });
        });
            const hotImages = HotImagesSorted;
            const freshImages = freshImagesNotSorted.reverse();
            console.log("TEZZe");
            return {hotImages,freshImages};

    } else{
            console.log("fff");
            const hotImages = [];
            const freshImages = Images.reverse();
            return {hotImages,freshImages};
    }
}
