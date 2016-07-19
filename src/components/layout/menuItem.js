import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import * as actions from "./../../actions/actions";

class MenuItem extends Component {

    static propTypes = {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired
    };

    /**
     * Goto main view when clicking on logo.
     */
    handleClick() {
        this.props.dispatch(
            actions.navigateTo,
            this.props.id
        );
    }

    isActive() {
        var activeClass = "";
        if (this.props.view === this.props.id) {
            activeClass = "active";
        }
        return activeClass
    }

    /**
     * Render phase
     */
    render() {
        return (
            <li className={ this.isActive() }>
                <a onClick={ e => this.handleClick(e) }
                   title={ this.props.title }>
                    { this.props.name }
                </a>
            </li>
        )
    }
}

export default branch({view: ['view']}, MenuItem);
