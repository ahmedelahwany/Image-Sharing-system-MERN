import React from 'react';
import * as actions from '../../action/Images';
import Cookies from 'js-cookie';
import ErrorMessageWell from "../ErrorMessageWell";


class ImageRecordingForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            formData: '',
            progressPercent: 0,
            labelName : "Choose image to upload"
        };

        this.upload = this.upload.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
    }



        // Upload image
     upload ({ target: { files }}) {
            let hasToken =false;
            let accessToken = Cookies.get("access");
            if(accessToken) hasToken=true;
            console.log(hasToken);
            let data = new FormData();
            data.append('name', files[0]);
            data.append('imgName', files[0].name);
            data.append('hasToken',hasToken);
            console.log(data);
            console.log(this.state.labelName);
            this.setState({
                formData: data,
                labelName: files[0].name
            });
        }

    // Submit Form
     handleSubmit(e){
         e.preventDefault();

         this.setState({
             progressPercent: 0
         });
         const options = {
             onUploadProgress: (progressEvent) => {
                 const {loaded, total} = progressEvent;
                 let percent = Math.floor((loaded * 100) / total);
                 console.log(`${loaded}kb of ${total}kb | ${percent}%`);
                 this.setState({
                     progressPercent: percent
                 });
             }
         };
         setTimeout(() => {
             this.setState({
                 progressPercent: 0
             });
         },6000);
         actions.recordImage(this.state.formData, options);
         this.setState({
             formData: '',
             labelName: "choose an Image to upload"
         });

     }
  render() {
      return (
          <div
              className='d-flex m-4 justify-content-center align-items-center flex-column'
          >
              <ErrorMessageWell/>
              <form onSubmit={this.handleSubmit}>
                  <div className='progress mb-3 w-40'>
                      <div
                          className='progress-bar'
                          role='progressbar'
                          style={{width: `${this.state.progressPercent}%`}}
                          aria-valuenow={this.state.progressPercent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                      >
                          {this.state.progressPercent}
                      </div>
                  </div>
                  <div className='custom-file mb-3'>
                      <input
                          type='file'
                          className='custom-file-input'
                          id='inputGroupFile04'
                          aria-describedby='inputGroupFileAddon04'
                          onChange={this.upload}
                      />
                      <label className='custom-file-label' htmlFor='inputGroupFile04'>
                          {this.state.labelName}
                      </label>
                  </div>
                  <button type='submit' className='btn btn-primary w-100'>
                      Submit
                  </button>
              </form>
          </div>
      );
  }
}

export default ImageRecordingForm;
