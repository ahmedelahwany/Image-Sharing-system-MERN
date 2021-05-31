import React, { Component } from 'react';
import { Link } from 'react-router-dom';

 class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Image Upload System</Link>
                <div className="collpase navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Upload Image</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/hotimages" className="nav-link">Browse Hot Images</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/freshimages" className="nav-link">Browse Fresh Images</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;