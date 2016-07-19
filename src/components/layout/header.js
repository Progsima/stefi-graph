import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Logo from "./logo";
import Menu from "./menu";

class Header extends Component {

    static propTypes = {
        config: React.PropTypes.object.isRequired
    };

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
                        <Logo name={ this.props.config.name } url={ this.props.config.logo }/>
                    </div>
                    <Menu pages={ this.props.config.pages }/>
                </div>
            </header>
        )
    }
}

export default Header;
