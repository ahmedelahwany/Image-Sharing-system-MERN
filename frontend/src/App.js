import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route} from "react-router-dom";

import ImageRecordingForm from "./component/images/ImageRecordingForm";
import HotImagesList from "./component/images/HotImagesList";
import FreshImagesList from "./component/images/FreshImagesList";

import Navbar from "./component/navbar";

function App() {
  return (
      <Router>
          <div className="container">
              <Navbar />
              <br/>
              <Route path="/" exact component={ImageRecordingForm} />
              <Route path="/hotimages" component={HotImagesList} />
              <Route path="/freshimages" component={FreshImagesList} />
          </div>
      </Router>
  );
}

export default App;
