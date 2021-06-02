import React from 'react';
import store from '../../store/ImageStore';

import Image from '../images/Image';
import * as ImageActions from '../../action/Images';
import * as ErrorActions from '../../action/Notifications';

import ErrorMessageWell from "../ErrorMessageWell";
import Cookies from 'js-cookie';


class FreshImagesList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            freshImages:[],
            qeImages : []};
        this._updateStateFromStore = this._updateStateFromStore.bind(this);
        this.likeOrUpvote =this.likeOrUpvote.bind(this);
    }

    componentDidMount() {
        ImageActions.fetchAllImages();
        store.addChangeListener(this._updateStateFromStore);

    }

    componentWillUnmount() {
        store.removeChangeListener(this._updateStateFromStore);
    }

    _updateStateFromStore(){

        this.setState({
            qeImages: store._Images.AllImages,
            freshImages: store._Images.FreshImages,
        });

    }

    CheckLikedOrUpvoted (accessToken ,id, LikeOrUpvote){
        let Check =false;
        if(LikeOrUpvote){
            const image = this.state.qeImages.find(i=>i._id===id);
            image.likes.forEach((like)=>{
                if(like.token===accessToken) Check=true;
            });
        }  else{
            const image = this.state.qeImages.find(i=>i._id===id);
            image.upvotes.forEach((upvote)=>{
                if(upvote.token===accessToken) Check =true;
            });}
        return Check;
    }

    likeOrUpvote(id,LikeOrUpvote){
        let hasToken = true;
        let accessToken = Cookies.get("access");
        if(!accessToken) {
            hasToken = false;
            accessToken=0;
        }
        console.log(id);
        const image = this.state.qeImages.find(i=>i._id===id);
        console.log(image);
        let previousPayload = LikeOrUpvote? image.likes :image.upvotes;
        const formData ={
            hasToken,
            imgName:id,
            likes:LikeOrUpvote,
            payload: [...previousPayload,{ date:Date.now(),token:accessToken}]
        };
        if(hasToken){
            if(this.CheckLikedOrUpvoted(accessToken,id,LikeOrUpvote)) {
                ErrorActions.ShowErrorAndThenClear({
                    response: {data: {errors:`You have already ${LikeOrUpvote ? "Liked" : "Upvoted"} this photo`}}});
            } else{
                console.log("dasd");
                ImageActions.changeImage(formData,id);
            }
        }else{
            ImageActions.changeImage(formData,id);
        }

    }

    render() {
        return (
            <div  className='d-flex m-4 justify-content-center flex-column'>
                <ErrorMessageWell/>
                <h3>Fresh Images</h3>

                <div  className='d-flex m-3 justify-content-around align-items-center flex-row flex-wrap'>
                    {
                        this.state.freshImages.map(({_id,createdAt, likes, upvotes, image}) => {
                            return (
                                <Image key={_id}
                                       _id={_id}
                                       createdAt={createdAt}
                                       likes={likes.length}
                                       upvotes={upvotes.length}
                                       image={image}
                                       likeOrUpvote={this.likeOrUpvote}/>
                            );
                        })
                    }
                </div>

            </div>
        );
    }
}

export default FreshImagesList;
