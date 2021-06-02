import React from 'react';
import PropTypes from 'prop-types';


function Image (props){
    return(
        <div key={props._id} className="card mt-3" style={{width: "250px" }}>
            <img className="card-img-top img-fluid" src={props.image} alt="Card image"/>
            <div className="card-body">
                <p className="card-text">Uploaded at {new Date(props.createdAt).toString()}</p>
                <a onClick={()=>props.likeOrUpvote(props._id,true)} className="btn btn-danger m-2">Like  {props.likes}</a>
                <a onClick={()=>props.likeOrUpvote(props._id,false)} className="btn btn-success m-2">Upvote {props.upvotes}</a>

            </div>
        </div>
    );
}
Image.propTypes = {
    image: PropTypes.string,
    _id: PropTypes.string,
    createdAt:PropTypes.any,
    likes:PropTypes.number,
    upvotes:PropTypes.number,
    likeOrUpvote: PropTypes.func,
};

export default Image;