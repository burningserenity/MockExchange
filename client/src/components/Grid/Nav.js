import React from "react";

const Nav = () =>
    <nav className="navbar">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="collapsed navbar-toggle">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                </button>
                <a href="/" className="navbar-brand">
                    Stuff
                </a>
            </div>
        </div>
    </nav>

export default Nav;
