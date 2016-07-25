import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import * as sitemap from "./../../actions/sitemap";

class MenuItem extends Component {

    static propTypes = {
        page: React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            path: React.PropTypes.string.isRequired
        }).isRequired
    };

    /**
     * Goto main view when clicking on logo.
     */
    handleClick() {
        this.props.dispatch( sitemap.navigateTo, this.props.page);
    }

    isActive() {
        console.log("[MENUITEM]: page hash is " + sitemap.getPageHashFromView(this.props.view) + "\n\t Hash is " + window.location.hash);
        var activeClass = "";

        // if we are in the page or we are in the path of the display page
        var pageHash = '#' + sitemap.getPageHashFromView(this.props.page.state.view);
        if (window.location.hash.startsWith(pageHash)) {
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
                   title={ this.props.page.title }>
                    { this.props.page.name }
                </a>
            </li>
        )
    }
}

export default branch({view: ['view']}, MenuItem);
