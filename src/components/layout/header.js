import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Logo from "./logo";
import Menu from "./menu";
import config from "./../../config";

class Header extends Component {

    render() {
        return (
            <header className="navbar">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Logo name={ config.name } url={ config.logo }/>
                    </div>
                    <nav id="navbar" className="nav navbar-nav navbar-right">
                        <Menu pages={ config.sitemap } styleClass="nav navbar-nav"/>
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;
